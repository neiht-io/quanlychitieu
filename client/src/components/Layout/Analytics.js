import React from 'react'
import { Progress } from 'antd'

const Analytics = ({ allTransection }) => {

    //catelories 
    const categories = ['food', 'fashion', 'car', 'bus', 'salary']

    //total transaction
    const totalTransaction = allTransection.length
    const totalIncomeTransactions = allTransection.filter(transections => transections.type === 'income')
    const totalExpenseTransactions = allTransection.filter(transections => transections.type === 'expense')
    const totalIncomePercent = (totalIncomeTransactions.length / totalTransaction) * 100
    const totalExpensePercent = (totalExpenseTransactions.length / totalTransaction) * 100

    //total turnover 
    const totalTurnover = allTransection.reduce((acc, transections) => acc + transections.amount, 0)

    const totalIncomeTurnover = allTransection.filter(transections => transections.type === 'income'
    ).reduce((acc, transections) => acc + transections.amount, 0)

    const totalExpenseTurnover = allTransection.filter(transections => transections.type === 'expense'
    ).reduce((acc, transections) => acc + transections.amount, 0)

    const returCash = (totalIncomeTurnover - totalExpenseTurnover)
    const totalIncomeTurnoverPercent = (totalIncomeTurnover / totalTurnover) * 100
    const totalExpenseTurnoverPercent = (totalExpenseTurnover / totalTurnover) * 100

    return (
        <>
            <div className='row'>
                <div className='col-md-4'>
                    <div className='card'>
                        <div className='card-header'>
                            <h5>Total Transactions : {totalTransaction}</h5>
                        </div>
                        <div className='mx-2 card-body analytics-container'>
                            <h6 className='text-success'>Income: {totalIncomeTransactions.length}</h6>
                            <h6 className='text-danger'>Expense : {totalExpenseTransactions.length}</h6>
                        </div>

                        <div className='mx-2 card-body analytics-container'>
                            <Progress type='circle' strokeColor={'green'}
                                className='mx-2'
                                percent={totalIncomePercent.toFixed(0)}
                                format={() => <span style={{ color: 'black' }}>{totalIncomePercent.toFixed(0)}%</span>}
                            />

                            <Progress type='circle' strokeColor={'red'}
                                className='mx-2'
                                percent={totalExpensePercent.toFixed(0)}
                                format={() => <span style={{ color: 'black' }}>{totalExpensePercent.toFixed(0)}%</span>}
                            />

                        </div>

                    </div>
                </div>


                <div className='col-md-4'>
                    <div className='card'>
                        <div className='card-header'>
                            <h5>Total Turnover: {' '}
                                <span style={{ color: returCash >= 0 ? 'green' : 'red' }}>
                                    {returCash}
                                </span>
                            </h5>
                        </div>
                        <div className='mx-2 card-body analytics-container'>
                            <h6 className='text-success'>Income: {totalIncomeTurnover}</h6>
                            <h6 className='text-danger'>Expense : {totalExpenseTurnover}</h6>
                        </div>

                        <div className='mx-2 card-body analytics-container'>
                            <Progress type='circle' strokeColor={'green'}
                                className='mx-2'
                                percent={totalIncomeTurnoverPercent.toFixed(1)}
                                format={() => <span style={{ color: 'black' }}>{totalIncomeTurnoverPercent.toFixed(0)}%</span>}
                            />

                            <Progress type='circle' strokeColor={'red'}
                                className='mx-2'
                                percent={totalExpenseTurnoverPercent.toFixed(0)}
                                format={() => <span style={{ color: 'black' }}>{totalExpenseTurnoverPercent.toFixed(0)}%</span>}
                            />

                        </div>

                    </div>
                </div>

                <div className='row mt-3'>
                    <div className='col-md-4'>
                        <h4>Categorywise Income</h4>
                        {
                            categories.map(category => {
                                const amount = allTransection
                                    .filter(transections =>
                                        transections.type === 'income' &&
                                        transections.category === category
                                    )
                                    .reduce((acc, transections) => acc + transections.amount, 0)
                                return (
                                    amount > 0 && (
                                        <div className='card'>
                                            <div className='card-body'>
                                                <h5>{category}</h5>
                                                <Progress
                                                    format={() => <span style={{ color: 'black' }}>{((amount / totalIncomeTurnover) * 100).toFixed(0)}%</span>}
                                                    percent={((amount / totalIncomeTurnover) * 100).toFixed(0)}  />
                                            </div>
                                        </div>
                                    )
                                )
                            })
                        }
                    </div>



                    <div className='col-md-4'>
                        <h4>Categorywise Expense</h4>
                        {
                            categories.map(category => {
                                const amount = allTransection
                                    .filter(transections =>
                                        transections.type === 'expense' &&
                                        transections.category === category
                                    )
                                    .reduce((acc, transections) => acc + transections.amount, 0)
                                return (
                                    amount > 0 && (
                                        <div className='card'>
                                            <div className='card-body'>
                                                <h5>{category}</h5>
                                                <Progress
                                                    strokeColor={'red'}
                                                    success={{ color: 'red' }}
                                                    format={() => <span style={{ color: 'black' }}>{((amount / totalExpenseTurnover) * 100).toFixed(0)}%</span>}
                                                    percent={((amount / totalExpenseTurnover) * 100).toFixed(0)}  />
                                                    
                                            </div>
                                        </div>
                                    )
                                )
                            })
                        }
                    </div>

                </div>

            </div>
        </>
    )
}

export default Analytics
