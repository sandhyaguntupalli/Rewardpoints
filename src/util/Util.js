import React from 'react';
export const totalRewards = (amount) => {
    let rewardPoints = 0;
    if(amount >= 100){
        rewardPoints = (2 * (amount - 100)) + 50;
    }
    if(amount > 50 && amount <= 100){
        rewardPoints += (amount - 50)
    }
    return rewardPoints; 
}

export const fetchTableHeader = (data) => {
    if(data.length > 0){
        let header = Object.keys(data[0]);
        
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }
}

//export default totalRewards;