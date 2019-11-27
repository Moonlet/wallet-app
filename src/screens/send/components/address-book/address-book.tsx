import React from 'react';
import { View, Image, TouchableOpacity, SafeAreaView, SectionList } from 'react-native';
import stylesProvider from './styles';
import { IReduxState } from '../../../../redux/state';
import { withTheme } from '../../../../core/theme/with-theme';
import { Icon } from '../../../../components/icon';
import { ITheme } from '../../../../core/theme/itheme';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
// import { IAccountState } from '../../../../redux/wallets/state';
import { IContactsState } from '../../../../redux/contacts/state';
import { selectContacts } from '../../../../redux/contacts/selectors';
import { formatAddress } from '../../../../core/utils/format-address';
import { translate } from '../../../../core/i18n';

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
    contacts: IContactsState[];
    // onAccountSelection: (contact: IContactsState) => any;
}

interface IState {
    contactsList: any;
}

export const mapStateToProps = (state: IReduxState) => {
    return {
        contacts: selectContacts(state)
    };
};

export class AddressBookComponent extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            contactsList: []
        };
    }

    public componentDidMount() {
        const contactsList = [];

        this.props.contacts.map(contact =>
            contactsList.push({
                title: String(contact.name).charAt(0),
                data: [contact]
            })
        );

        this.setState({ contactsList });
    }

    public renderItem({ item }) {
        const styles = this.props.styles;

        return (
            <View>
                <TouchableOpacity
                    style={styles.rowContainer}
                    // onPress={() => {
                    //     this.props.onAccountSelection(account);
                    // }}
                >
                    <View>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.address}>{formatAddress(item.address)}</Text>
                    </View>
                    <Icon name="add-circle" size={24} style={styles.icon} />
                </TouchableOpacity>
                <View style={styles.divider} />
            </View>
        );
    }

    public render() {
        const styles = this.props.styles;
        const { contactsList } = this.state;

        if (contactsList && contactsList.length === 0) {
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
                        sections={contactsList}
                        keyExtractor={(item, index) => item + index}
                        renderItem={item => this.renderItem(item)}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={styles.sectionTitle}>{title}</Text>
                        )}
                    />
                </SafeAreaView>
            );
        }
    }
}

export const AddressBook = smartConnect(AddressBookComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
