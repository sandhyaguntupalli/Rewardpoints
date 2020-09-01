import React, { Component } from 'react';
import {Route, withRouter} from 'react-router-dom';
import transactionData from '../../service/DataService';
import Customer from './CustomerRewards';
import './Customers.css';
import * as util from '../../util/Util';

class Customers extends Component{

    state = {
        customers : []
    }

    componentDidMount(){
        const transactionsData = transactionData();
        this.fetchCustomerData(transactionsData);
    }    
    
    fetchCustomerData = (transactionsData) => {
        const customers = Array.from([...new Set(
            transactionsData.map(transaction => transaction.customerId))]).map(custId => {
                const transData = transactionsData.filter(transaction => transaction.customerId === custId);
                return {
                    customerId : custId,
                    customerName : transactionsData.find(transaction => transaction.customerId === custId).customerName,
                    amountSpent : transData.reduce((sum, current) => {
                        return sum + current.amount
                    } , 0),
                    totalRewards : transData.reduce((sum, current) => {
                        return sum + util.totalRewards(current.amount)
                    } , 0) 
                };
            });
        this.setState(() => {
            return {customers : customers};
        })
    }
    
    fetchTableData = () => {
        return this.state.customers.map((customer, key) => {
            const {customerId, customerName, amountSpent, totalRewards} =  customer;
            return (
                <tr key={customerId} onClick = {() => this.getCustomerRewardPoints(customerId, customerName)}>
                    <td>{customerId}</td>
                    <td>{customerName}</td>
                    <td>{amountSpent}</td>
                    <td>{totalRewards}</td>
                </tr>
            )
        })
    }
    
    getCustomerRewardPoints = (customerId, customerName) => {
        this.props.history.push({pathname:'/' + customerId, search:customerName});        
    }
    
    render(){
       return (
            <div>
                <h1>Customers Reward Points</h1>
                <table id="customers">
                    <tbody>
                        <tr>{util.fetchTableHeader(this.state.customers)}</tr>
                        {this.fetchTableData()}
                    </tbody>
                </table>
                <Route path="/:customerId" exact component={Customer}/>
            </div>
        )
    }
}

export default withRouter(Customers);