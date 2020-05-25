import React from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    SectionList,
    SectionListData
} from 'react-native';
import stylesProvider from './styles';
import { IReduxState } from '../../../../redux/state';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Icon } from '../../../../components/icon/icon';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
import { IContactState } from '../../../../redux/contacts/state';
import { selectContacts } from '../../../../redux/contacts/selectors';
import { formatAddress } from '../../../../core/utils/format-address';
import { translate } from '../../../../core/i18n';
import { Blockchain } from '../../../../core/blockchain/types';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { deleteContact, updateContactName } from '../../../../redux/contacts/actions';
import { ICON_SIZE, normalize } from '../../../../styles/dimensions';
import { IHints, HintsScreen, HintsComponent } from '../../../../redux/app/state';
import { updateDisplayedHint } from '../../../../redux/app/actions';
import { DISPLAY_HINTS_TIMES } from '../../../../core/constants/app';

export interface IReduxProps {
    contacts: ReadonlyArray<SectionListData<IContactState>>;
    deleteContact: typeof deleteContact;
    updateContactName: typeof updateContactName;
    hints: IHints;
    updateDisplayedHint: typeof updateDisplayedHint;
}

export interface IExternalProps {
    blockchain: Blockchain;
    onContactSelected: (contact: IContactState) => void;
    selectedAddress: string;
}

export const mapStateToProps = (state: IReduxState, ownprops: IExternalProps) => {
    return {
        contacts: selectContacts(state, ownprops.blockchain),
        hints: state.app.hints
    };
};

const mapDispatchToProps = {
    deleteContact,
    updateContactName,
    updateDisplayedHint
};

export class AddressBookComponent extends React.Component<
    IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public contactsSwipeableRef: ReadonlyArray<string> = [];
    public currentlyOpenSwipeable: string = null;

    public componentDidMount() {
        setTimeout(() => this.showHints(), 500);
    }

    private showHints() {
        if (
            this.props.contacts &&
            this.props.contacts.length !== 0 &&
            this.props.hints.SEND_SCREEN.ADDRESS_BOOK < DISPLAY_HINTS_TIMES
        ) {
            const contacts = Object.values(this.props.contacts[0]);
            const contact = contacts[1][0];
            const index = `${contact.blockchain}|${contact.address}`;

            this.onSwipeableWillOpen(index);
            this.contactsSwipeableRef[index] && this.contactsSwipeableRef[index].openLeft();
            this.props.updateDisplayedHint(HintsScreen.SEND_SCREEN, HintsComponent.ADDRESS_BOOK);

            setTimeout(() => this.closeCurrentOpenedSwipable(), 1000);
        }
    }

    public closeCurrentOpenedSwipable() {
        this.contactsSwipeableRef[this.currentlyOpenSwipeable] &&
            this.contactsSwipeableRef[this.currentlyOpenSwipeable].close();
    }

    public renderLeftActions(contact: IContactState) {
        const styles = this.props.styles;
        return (
            <View style={styles.leftActionsContainer}>
                <TouchableOpacity
                    style={styles.action}
                    onPress={() => {
                        this.props.deleteContact(contact.blockchain, contact.address);
                        this.closeCurrentOpenedSwipable();
                    }}
                >
                    <Icon name="bin" size={normalize(32)} style={styles.iconActionNegative} />
                    <Text style={styles.textActionNegative}>{translate('Send.deleteContact')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.action}
                    onPress={() => {
                        this.props.updateContactName(contact.blockchain, contact.address);
                        this.closeCurrentOpenedSwipable();
                    }}
                >
                    <Icon name="pencil" size={normalize(28)} style={styles.iconActionPositive} />
                    <Text style={styles.textActionPositive}>
                        {translate('Send.editContactName')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    public onSwipeableWillOpen(index: string) {
        if (
            index !== this.currentlyOpenSwipeable &&
            this.contactsSwipeableRef[this.currentlyOpenSwipeable]
        ) {
            this.closeCurrentOpenedSwipable();
        }

        this.currentlyOpenSwipeable = index;
    }

    public renderContact(contact: IContactState, index: number) {
        const styles = this.props.styles;
        const key = `${contact.blockchain}|${contact.address}`;
        const isSelected =
            this.props.selectedAddress.toLowerCase() === contact.address.toLowerCase();

        return (
            <Swipeable
                key={key}
                ref={ref => (this.contactsSwipeableRef[key] = ref)}
                renderLeftActions={() => this.renderLeftActions(contact)}
                onSwipeableWillOpen={() => this.onSwipeableWillOpen(key)}
            >
                <TouchableOpacity
                    style={styles.rowContainer}
                    onPress={() => this.props.onContactSelected(contact)}
                    activeOpacity={1}
                >
                    <View>
                        <Text style={[styles.name, isSelected && styles.selectedText]}>
                            {contact.name}
                        </Text>
                        <Text style={[styles.address, isSelected && styles.selectedText]}>
                            {formatAddress(contact.address, contact.blockchain)}
                        </Text>
                    </View>
                    <Icon
                        name={isSelected ? 'check-1' : 'add-circle'}
                        size={ICON_SIZE}
                        style={styles.icon}
                    />
                </TouchableOpacity>

                {index !== this.props.contacts.length - 1 && <View style={styles.divider} />}
            </Swipeable>
        );
    }

    public render() {
        const styles = this.props.styles;
        const { contacts } = this.props;

        if (contacts && contacts.length === 0) {
            return (
                <View style={styles.emptyAddressContainer}>
                    <Image
                        style={styles.logoImage}
                        source={require('../../../../assets/images/png/moonlet_space_gray.png')}
                    />
                    <Text style={styles.emptyAddressText}>{translate('Send.emptyAddress')}</Text>
                    <Text style={styles.addAddressBookText}>
                        {translate('Send.addAddressBook')}
                    </Text>
                </View>
            );
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    <SectionList
                        sections={contacts}
                        keyExtractor={item => `${item.blockchain}|${item.address}`}
                        renderItem={({ item, index }) => this.renderContact(item, index)}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={styles.sectionTitle}>{title}</Text>
                        )}
                    />
                </SafeAreaView>
            );
        }
    }
}

export const AddressBook = smartConnect<IExternalProps>(AddressBookComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
