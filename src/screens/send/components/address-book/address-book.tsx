import React from 'react';
import { View, Image, TouchableOpacity, SafeAreaView, SectionList, Alert } from 'react-native';
import stylesProvider from './styles';
import { IReduxState } from '../../../../redux/state';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Icon } from '../../../../components/icon';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
import { IContactsState, IContactState } from '../../../../redux/contacts/state';
import { selectContacts } from '../../../../redux/contacts/selectors';
import { formatAddress } from '../../../../core/utils/format-address';
import { translate } from '../../../../core/i18n';
import { Blockchain } from '../../../../core/blockchain/types';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { deleteContact, updateContactName } from '../../../../redux/contacts/actions';

export interface IReduxProps {
    contacts: IContactsState[];
    deleteContact: typeof deleteContact;
    updateContactName: typeof updateContactName;
}

export interface IExternalProps {
    blockchain: Blockchain;
}

interface IState {
    openedSwipeIndex: number;
}

export const mapStateToProps = (state: IReduxState, ownprops: IExternalProps) => {
    return {
        contacts: selectContacts(state, ownprops.blockchain)
    };
};

const mapDispatchToProps = {
    deleteContact,
    updateContactName
};

export class AddressBookComponent extends React.Component<
    IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public walletSwipableRef: any[] = new Array();

    constructor(
        props: IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            openedSwipeIndex: -1
        };
    }

    public closeCurrentOpenedSwipable() {
        this.walletSwipableRef[this.state.openedSwipeIndex] &&
            this.walletSwipableRef[this.state.openedSwipeIndex].close();
    }

    public onPressUpdate(contact: IContactState) {
        const title = translate('Send.alertEditTitle');
        const message = translate('Send.alertEditDescription');
        const buttons = [
            {
                text: translate('App.labels.cancel'),
                onPress: () => {
                    /* console.log('Cancel Pressed')*/
                },
                type: 'cancel'
            },
            {
                text: translate('App.labels.save'),
                onPress: (inputValue: string) => {
                    if (inputValue !== '') {
                        this.closeCurrentOpenedSwipable();
                        this.props.updateContactName(contact, inputValue);
                    }
                },
                type: 'default'
            }
        ];
        const type = 'plain-text';

        Alert.prompt(title, message, buttons, type);
    }

    public renderLeftActions = (contact: IContactState) => {
        const styles = this.props.styles;
        return (
            <View style={styles.leftActionsContainer}>
                <TouchableOpacity
                    style={styles.action}
                    onPress={() => {
                        this.closeCurrentOpenedSwipable();
                        this.props.deleteContact(contact);
                    }}
                >
                    <Icon name="bin" size={32} style={styles.iconActionNegative} />
                    <Text style={styles.textActionNegative}>{translate('Send.deleteContact')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.action} onPress={() => this.onPressUpdate(contact)}>
                    <Icon name="pencil" size={28} style={styles.iconActionPositive} />
                    <Text style={styles.textActionPositive}>
                        {translate('Send.editContactName')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    public renderItem(item: IContactState, index: number) {
        const styles = this.props.styles;

        return (
            <Swipeable
                key={index}
                ref={ref => {
                    this.walletSwipableRef[index] = ref;
                }}
                renderLeftActions={() => this.renderLeftActions(item)}
                onSwipeableWillOpen={() => {
                    if (
                        index !== this.state.openedSwipeIndex &&
                        this.walletSwipableRef[this.state.openedSwipeIndex]
                    ) {
                        this.walletSwipableRef[this.state.openedSwipeIndex].close();
                    }
                    this.setState({ openedSwipeIndex: index });
                }}
            >
                <TouchableOpacity
                    style={styles.rowContainer}
                    onPress={() => {
                        // TODO
                        // this.props.onAccountSelection(account);
                    }}
                >
                    <View>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.address}>{formatAddress(item.address)}</Text>
                    </View>
                    <Icon name="add-circle" size={24} style={styles.icon} />
                </TouchableOpacity>
                <View style={styles.divider} />
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
                <SafeAreaView style={{ flex: 1 }}>
                    <SectionList
                        sections={contacts as []}
                        keyExtractor={({ item, index }) => `${index}`}
                        renderItem={({ item, index }) => this.renderItem(item, index)}
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
