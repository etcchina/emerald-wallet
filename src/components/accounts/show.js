import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { DescriptionList, DescriptionTitle, DescriptionData } from 'elements/dl';
import QRCode from 'qrcode.react';
import log from 'loglevel';
import { cardSpace } from 'lib/styles';
import { gotoScreen } from 'store/screenActions';

const TokenRow = ({ token }) => {
    const balance = token.get('balance') ? token.get('balance').getDecimalized() : '0';

    return (
        <div><span>{balance} {token.get('symbol')}</span></div>
    );
};
TokenRow.propTypes = {
    token: PropTypes.object.isRequired,
};


const Render = ({ account, createTx }) => {
    const value = `${account.get('balance') ? account.get('balance').getEther() : '?'} Ether`;

    return (
        <Card style={cardSpace}>
            <CardHeader
                title={`Address: ${account.get('id')}`}
                subtitle={value}
                actAsExpander={true}
                showExpandableButton={true}
            />
            <CardActions>
                <FlatButton label="Send"
                            onClick={createTx}
                            icon={<FontIcon className="fa fa-arrow-circle-o-right" />}/>
            </CardActions>
            <CardText expandable={true}>
                <Row>
                    <Col xs={8}>
                        <DescriptionList>
                            <DescriptionTitle>Address:</DescriptionTitle>
                            <DescriptionData>{account.get('id')}</DescriptionData>

                            <DescriptionTitle>Sent Transactions:</DescriptionTitle>
                            <DescriptionData>{account.get('txcount') || '0'}</DescriptionData>

                            <DescriptionTitle>Ether Balance:</DescriptionTitle>
                            <DescriptionData>{value}</DescriptionData>

                            <DescriptionTitle>Token Balances:</DescriptionTitle>
                            <DescriptionData>
                                {account
                                    .get('tokens')
                                    .map((tok) =>
                                        <TokenRow token={tok} key={tok.get('address')}/>
                                )}
                            </DescriptionData>

                        </DescriptionList>
                    </Col>
                    <Col xs={4} md={2} mdOffset={2}>
                        <QRCode value={account.get('id')} />
                    </Col>
                </Row>
            </CardText>
        </Card>
    );
};

Render.propTypes = {
    account: PropTypes.object.isRequired,
    createTx: PropTypes.func.isRequired,
};

const AccountShow = connect(
    (state, ownProps) => ({
    }),
    (dispatch, ownProps) => ({
        createTx: () => {
            const account = ownProps.account;
            log.debug('create tx from', account.get('id'));
            dispatch(gotoScreen('create-tx', account));
        },
    })
)(Render);

export default AccountShow;
