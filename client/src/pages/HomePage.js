
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, message, Table, DatePicker , Button} from 'antd';
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs';
import utc from 'dayjs-plugin-utc';
import axios from 'axios';
import Layout from '../components/Layout/Layout';
import Spiner from '../components/Layout/Spiner';
import Analytics from '../components/Layout/Analytics';
import * as XLSX from 'xlsx';

const { RangePicker } = DatePicker;

const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false)
    const today = dayjs();
    dayjs.extend(utc);
    const [form] = Form.useForm();
    const [allTransection, setAllTransection] = useState([])
    const [frequency, setFrequency] = useState('1')
    const [reference, setReference] = useState('all')
    const [selectedDate, setSelectedDate] = useState([])
    const [type, setType] = useState('all')
    const [viewData, setViewData] = useState('table')
    const [editable, setEditable] = useState(null)
    const [formKey, setFormKey] = useState(Date.now());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc')



    const handleSort = () => {
        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
        // Bạn cũng có thể chuyển giữa 'asc' và 'desc' mỗi lần nhấp vào cột.
    };

    //table data
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            sorter: (a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);

                if (sortOrder === 'asc') {
                    return dateA - dateB;
                } else {
                    return dateB - dateA;
                }
            },
            sortOrder,
            render: (text, record) => dayjs(text).format('DD/MM/YYYY'),
            onHeaderCell: () => ({
                onClick: handleSort,
            }),

        },
        {
            title: 'Amount',
            dataIndex: 'amount',
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Category',
            dataIndex: 'category',
        },
        {
            title: 'Reference',
            dataIndex: 'reference',
        },
        {
            title: 'Descriptios',
            dataIndex: 'description',
        },
        {
            title: 'Actions',

            render: (text, record) => (
                <div>
                    <EditOutlined
                        //   onClick={() => {
                        //     setEditable(record)
                        //     setShowModal(true)
                        //   }} 

                        onClick={() => openModal(record)}
                    />

                    <DeleteOutlined className='mx-2'
                        onClick={() => {
                            handleDelete(record)
                        }}
                    />
                </div>

            )
        },

    ]


    // Sửa đổi hàm exportToExcel
    const exportToExcel = () => {
        const dataToExport = allTransection;

        /* Chuyển đổi dữ liệu thành bảng tính */
        const ws = XLSX.utils.json_to_sheet(dataToExport);

        /* Tạo một workbook với một sheet duy nhất */
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* Lưu vào tệp */
        const fileName = 'transection.xlsx';
        XLSX.writeFile(wb, fileName);
    };



    //useEffect hook
    useEffect(() => {
        const getAllTransections = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'))
                setLoading(true)
                const res = await axios.post('/transections/get-transection', {
                    userid: user._id,
                    frequency,
                    selectedDate,
                    type,
                    reference
                })
                setLoading(false)

                setAllTransection(res.data)
                console.log(res.data)

            } catch (error) {
                console.log(error)
                message.error('Ftech Issue With Transection')
            }

        }
        getAllTransections()
    }, [frequency, selectedDate, type, reference])

    const getAllTransections = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            setLoading(true)
            const res = await axios.post('/transections/get-transection', {
                userid: user._id,
                frequency,
                selectedDate,
                type,
                reference
            })
            setLoading(false)
            setAllTransection(res.data)
            console.log(res.data)

        } catch (error) {
            console.log(error)
            message.error('Ftech Issue With Transection')
        }

    }


    // delet handle 
    const handleDelete = async (record) => {
        try {
            setLoading(true)
            await axios.post('/transections/delete-transection', { transectionId: record._id })
            setLoading(false)
            message.success('Delete Transection successfully')
            setAllTransection((prevData) => prevData.filter(item => item._id !== record._id));

        } catch (error) {
            setLoading()
            console.log(error)
            message.error('unable to delete')

        }

    }


    // Form handle
    const handleSubmit = async (values) => {
        console.log(values);
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            setLoading(true)
            if (editable) {
                await axios.post('/transections/edit-transection', {
                    payload: {
                        ...values,
                        userId: user._id

                    },
                    transactionId: editable._id
                })
                setLoading(false)
                message.success('Update Transection successfully')
                setEditable(null);

            } else {
                await axios.post('/transections/add-transection', { ...values, userid: user._id })
                setLoading(false)
                message.success('Transaction add successfully')


            }

            getAllTransections();

            setShowModal(false); // close modal after add transection
            form.resetFields();
            setEditable(null)

        } catch (error) {
            setLoading(false)
            message.error('Faild to add transection')

        }

    };


    // Khi mở modal, setFormKey để tạo một key mới
    const openModal = (record) => {
        console.log("Editable Record:", record);
        setEditable(record ? record : null); // Đặt là null nếu record không được cung cấp
        setIsModalOpen(true);
        setShowModal(true);
        setFormKey(Date.now()); // Đặt formKey thành giá trị mới

        if (record) {
            //cái này là lấy từ record
            form.setFieldsValue({
                amount: record.amount,
                type: record.type,
                category: record.category,
                date: dayjs(record.date).format('YYYY-MM-DD'),
                reference: record.reference,
                description: record.description

            });
        }
        else {
            form.setFieldsValue({
                amount: null,
                type: null,
                category: null,
                date: today.format('YYYY-MM-DD'), // cái này mặc định thêm mới
                reference: "default wallet",
                description: null
            });
        }

    };




    // useEffect để kiểm tra nếu modal đã đóng thì reset form
    useEffect(() => {
        if (!isModalOpen) {
            setEditable(null);
            form.resetFields()
            console.log("After reset:", form.getFieldsValue());

            setFormKey(Date.now());
        }
    }, [isModalOpen, form]);


    // Modal form
    const modalForm = (
        <Modal
            title={editable ? 'Edit Transaction' : 'Add Transaction'}
            open={showModal}
            onCancel={() => {
                setShowModal(false);
                setIsModalOpen(false); // Đặt trạng thái mở modal thành false khi modal đóng

            }}
            footer={null}

        >
            <Form key={formKey} // Key thay đổi sẽ làm cho form reset
                layout="vertical"
                onFinish={handleSubmit}
                form={form}
                initialValues={editable}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Amount"
                            name="amount"
                            rules={[
                                { required: true, message: 'Please input the Amount!' },
                                {
                                    pattern: /^[0-9]+$/,
                                    message: 'Please enter a valid number!',
                                },
                            ]}
                        >
                            <Input type="text" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input the Type!' }]}
                        >
                            <Select>
                                <Select.Option value="income">Income</Select.Option>
                                <Select.Option value="expense">Expense</Select.Option>
                            </Select>
                        </Form.Item>

                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Category"
                            name="category"
                            rules={[{ required: true, message: 'Please input the Category!' }]}
                        >
                            <Select>
                                <Select.Option value="salary">Salary</Select.Option>
                                <Select.Option value="medicin">Bus</Select.Option>
                                <Select.Option value="relax">Car</Select.Option>
                                <Select.Option value="fashion">Fashion</Select.Option>
                                <Select.Option value="food">Food</Select.Option>
                            </Select>
                            {/* <Input type="text" /> */}

                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Date"
                            name="date"
                            rules={[{ required: true, message: 'Please input the Date!' }]}
                            // nếu có ko edit thì ngày mặc đinh, nếu có thì lấy ngày lên theo đúng format. nhưng nó đéo lấy
                            initialValue={editable ? dayjs(editable.date).format('YYYY-MM-DD') : today.format('YYYY-MM-DD')}
                        >
                            <Input type="date" max={today.format('YYYY-MM-DD')} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Reference"
                            name="reference"
                            rules={[{ required: true, message: 'Please input the Reference !' }]}
                            initialValue={editable ? editable.reference : "default wallet"}

                        >
                            <Select>
                                <Select.Option value="default wallet">Default Wallet</Select.Option>
                                <Select.Option value="deposit">Deposit</Select.Option>
                                <Select.Option value="personally">Personally</Select.Option>

                            </Select>
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Descriptions"
                            name="description"

                        >
                            <Input type="text" />
                        </Form.Item>

                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Form.Item>
                            <button type="submit" className='btn btn-primary'>
                                Save
                            </button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            {/* </div> */}
        </Modal>
    );


    return (
        <Layout>
            {loading && <Spiner />}
            <div className='filters-box'>
                <div className="filters">
                    <div>
                        <h6>Select Frequency</h6>
                        <Select value={frequency} onChange={(values) => setFrequency(values)} style={{ width: '100%' }} >
                            <Select.Option value='1'>Today</Select.Option>
                            <Select.Option value='6'>Last Week</Select.Option>
                            <Select.Option value='29'>Last Month</Select.Option >
                            <Select.Option value='364' >Last Year</Select.Option>
                            <Select.Option value='custome' >Custome</Select.Option>

                        </Select>
                        {frequency === 'custome' && (<RangePicker
                            value={selectedDate}
                            onChange={(values) => setSelectedDate(values)}
                            style={{ width: '70%' }}
                        />
                        )}

                    </div>

                    <div>
                        <h6>Type</h6>
                        <Select value={type} onChange={(values) => setType(values)} style={{ width: '100px' }} >
                            <Select.Option value='all' >All</Select.Option>
                            <Select.Option value='income' >Income</Select.Option>
                            <Select.Option value='expense' >Expense</Select.Option>
                        </Select>

                    </div>

                    <div>
                        <h6>Wallet</h6>
                        <Select value={reference} onChange={(values) => setReference(values)} style={{ width: '130px' }} >
                            <Select.Option value='all' >All</Select.Option>
                            <Select.Option value='default wallet' >Default Wallet</Select.Option>
                            <Select.Option value='deposit' >Deposit</Select.Option>
                            <Select.Option value='personally' >Personally</Select.Option>
                        </Select>

                    </div>


                    <div className='switch-icons'>
                        <AreaChartOutlined
                            className={`mx-2 ${viewData === 'analystics' ? 'active-icon' : 'inactive-icon'}`}
                            onClick={() => setViewData('analystics')}
                        />
                        <UnorderedListOutlined
                            className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`}
                            onClick={() => setViewData('table')}
                        />

                    </div>


                    <div>
                        <button className="btn btn-primary"
                            // onClick={() => setShowModal(true) }
                            onClick={() => openModal(null)}
                        >
                            Add new
                        </button>
                    </div>
                </div>
            </div>


            <div className="content">
                <>
                <Button
                        type="primary"
                        onClick={exportToExcel}
                        icon={<DownloadOutlined />}
                        style={{ position: 'relative', top: 0, left: 12 }}
                    >
                        Xuất
                    </Button>
                </>
                <div className='table-content-box'>
                    {viewData === 'table'
                        ? (<Table columns={columns} dataSource={allTransection} />
                        ) : (<Analytics allTransection={allTransection} />
                        )}

                </div>

            </div>

            {modalForm}
        </Layout>
    );
};

export default HomePage;
