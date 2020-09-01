import React, { Component } from 'react';

import transactionData from '../../service/DataService';
import * as util from '../../util/Util';
import './Customers.css';

class Customer extends Component{
    state = {
        data : [],
        customerData : [],
        isMonthlyDataClicked : false,
        month : ""
    }

    componentDidMount(){
        this.fetchCustomerData(this.props.match.params.customerId);
    }

    fetchCustomerData = (customerId) => {
        const transData = transactionData();
        const customerData = transData.filter(transaction => transaction.customerId === parseInt(customerId));
        this.setState(()=>{
            return {customerData : customerData}
        })
        const customerMonthsData = Array.from([...new Set(
            customerData.map(transaction => transaction.transactionDt.toLocaleString("default", { month: "long" })
                ))]).map(mon => {
                    const custData = customerData.filter(transaction => {
                        return transaction.transactionDt.toLocaleString("default", { month: "long" }) === mon
                    });
                    return {
                        month : mon,
                        amountSpent : custData.reduce((sum, current) => {
                            return sum + current.amount
                        } , 0),
                        totalRewards : custData.reduce((sum, current) => {
                            return sum + util.totalRewards(current.amount)
                        } , 0) 
                    };
            });        
            this.setState(() => {
                return {data : customerMonthsData};
            })
    }

    componentDidUpdate(prevProps, prevState){
        
        if(prevProps.match.params.customerId !== this.props.match.params.customerId){
            this.fetchCustomerData(this.props.match.params.customerId);
            this.setState(() => {
                return {isMonthlyDataClicked : false}
            }) 
        }
        if(prevState.month !== this.state.month){
            this.fetchCustomerData(this.props.match.params.customerId);
            this.getMonthlyData(this.state.month);
        }

    }

    getMonthlyData = (month) => {
        this.setState(() => {
            return {isMonthlyDataClicked : true, month : month}
        });
    }

    fetchTableData = () => {
        return this.state.data.map((dt, key) => {
            const {month, amountSpent, totalRewards} =  dt;
            return (
                <tr key={month} onClick = {()=>this.getMonthlyData(month)}>
                    <td>{month}</td>
                    <td>{amountSpent}</td>
                    <td>{totalRewards}</td>
                </tr>
            )
        })
    }

    fetchMonthData = (customerName) => {        
        let data = "";           
        const custData = this.state.customerData.filter(transaction => {
            return transaction.transactionDt.toLocaleString("default", { month: "long" }) === this.state.month
        });
        data = custData.map((dt, key) => {
            return (
                <tr key={key}>                        
                    <td>{dt.transactionDt.toLocaleString().slice(0,-13)}</td>
                    <td>{dt.amount}</td>
                    <td>{util.totalRewards(dt.amount)}</td>
                </tr>
            )
        });
        return (<div>
            <h1>Reward points of {customerName} for the month of {this.state.month}</h1>
            <table id="customers">
            <tbody>
                <tr>
                    <th>TRANSACTIONDATE</th>
                    <th>AMOUNT</th>
                    <th>REWARDPOINTS</th>
                </tr>
                {data}
            </tbody>
        </table>
        </div>)
    }

    render(){
        const customerName = this.props.location.search.slice(1);
        const isMonthlyDataClicked = this.state.isMonthlyDataClicked;
        let data = "";
        if(isMonthlyDataClicked){  
            data = this.fetchMonthData(customerName);
        }
        
        return (
            <div>
                <h1>Reward points of {customerName}</h1>
                <table id="customers">
                    <tbody>
                        <tr>{util.fetchTableHeader(this.state.data)}</tr>
                        {this.fetchTableData()}
                    </tbody>
                </table>
                {data}
                
                
            </div>
        )
    }
}
export default Customer;