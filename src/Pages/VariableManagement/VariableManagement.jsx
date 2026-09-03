import React, { useEffect } from 'react'
import PageName from '../../Components/Shared/PageName'

import { Table, Input, Button, Form } from 'antd';
import Loading from '../../Components/Loading/Loading';
import { useGetAllVariableQuery, useUpdateVariableMutation } from '../../redux/api/variableManagementApi';
import { toast } from 'sonner';

const VariableManagement = () => {
  const [form] = Form.useForm()
  // All API
  const { data: allVariables, isLoading } = useGetAllVariableQuery()
  const [updateVariable] = useUpdateVariableMutation()

// console.log(allVariables?.data?.perDollarMexicanPeso * 10)


  const data = [
    { key: '1', label: 'Surcharge Factor', name: "surcharge", placeholder: 'Surcharge Value (%)' },
    { key: '2', label: 'Coverage Radius', name: "coverageRadius", placeholder: 'Radius Value (km)' },
    { key: '3', label: 'Minimum Start Fee', name: "minimumStartFee", placeholder: 'Value ($)' },
    { key: '4', label: 'Minimum Weight of Load Fee', name: "minimumWeightLoad", placeholder: 'Value ($)' },
    { key: '5', label: 'Minimum By Distance Fee', name: "minimumDurationFee", placeholder: 'Value ($)' },
    { key: '6', label: 'Maximum Start Fee', name: "maximumStartFee", placeholder: 'Value ($)' },
    { key: '7', label: 'Maximum Weight of Load Fee', name: "maximumWeightLoad", placeholder: 'Value ($)' },
    { key: '8', label: 'Maximum By Distance Fee', name: "maximumDistanceOfFee", placeholder: 'Value ($)' },
    { key: '9', label: 'Conversion Rate (Dollar to Mexican peso)', name: "perDollarMexicanPeso", placeholder: '1 Dollar =', addonAfter: 'Mexican peso' },
  ];

  useEffect(() => {
    if (allVariables?.data) {
      const formValues = data.reduce((acc, item) => {
        acc[item.name] = allVariables.data[item.name];
        return acc;
      }, {});

      form.setFieldsValue(formValues);
    }
  }, [allVariables?.data, form]);

  const handleSubmit = (values) => {
    updateVariable(values).unwrap()
      .then((payload) => toast.success(payload?.message))
      .catch((error) => toast.error(error?.data?.message));
  };

  return (
    <div className=" mx-auto bg-white p-8 rounded-lg shadow-md">
      <PageName name={'Variable Management'} />
      <div className="flex justify-between items-center border-b pb-4 mb-6 pr-72 mt-10">
        <span className="text-lg font-semibold">SL no.</span>
        <span className="text-lg font-semibold ">Variable</span>
        <span className="text-lg font-semibold">Input</span>
      </div>
      {isLoading ? (
        <Loading type="form" />
      ) : (
        <Form form={form} onFinish={handleSubmit} className="space-y-4">
          {data.map((item, index) => (
            <div key={item.key} className="flex items-center space-x-4">
              {/* Serial Number */}
              <span className="w-20 text-center  text-gray-500">{String(index + 1).padStart(2, '0')}</span>

              {/* Label */}
              <span className="flex-1 pl-96 text-left  mx-auto font-medium">{item.label}</span>

              {/* Input Field */}
              <Form.Item
                name={item.name}
                label={item?.placeholder}
                className=""
              // rules={[{ required: true, message: `Please input ${item.label.toLowerCase()}` }]}
              >
                <Input
                  placeholder={item.placeholder}
                  addonAfter={item.addonAfter}
                  className="border-gray-300 rounded-md"
                />
              </Form.Item>
            </div>
          ))}
          <div className="text-center mt-8">
            <button htmlType="submit" className="bg-black text-white px-10 py-2 rounded-full">
              Save
            </button>
          </div>
        </Form>
      )}
    </div>
  )
}

export default VariableManagement