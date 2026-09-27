import React, { useEffect, useState } from "react";
import PageName from "../../Components/Shared/PageName";
import { IoIosAdd } from "react-icons/io";
import { Form, Input, InputNumber, Modal, Popconfirm, Select, Table, Tag, Tooltip } from "antd";
import { CiEdit, CiCircleInfo } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import {
  useCrateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from "../../redux/api/categoryManagementApi";
import { toast } from "sonner";
import Loading from "../../Components/Loading/Loading";

const CategoryManagement = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [categoryStatus, setCategoryStatus] = useState("Waste");
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [singleCategory, setSingleCategory] = useState(null);

  // Watch markup types for conditional form fields
  const [addMarkupType, setAddMarkupType] = useState("percentage");
  const [editMarkupType, setEditMarkupType] = useState("percentage");

  // category management api
  const [createCategory] = useCrateCategoryMutation();
  const { data: allCategory, isLoading } = useGetCategoryQuery(categoryStatus);
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const columns = [
    {
      title: "SL no.",
      dataIndex: "slno",
      key: "slno",
      width: 70,
    },
    {
      title: "Category (English)",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Category (Spanish)",
      dataIndex: "category_spain",
      key: "category_spain",
    },
    {
      title: "Markup Type",
      dataIndex: "markupType",
      key: "markupType",
      render: (type) => {
        if (type === "fixed") {
          return <Tag color="green" className="font-medium px-2 py-0.5">Fixed Amount ($)</Tag>;
        }
        if (type === "formula") {
          return <Tag color="purple" className="font-medium px-2 py-0.5">Dynamic Formula</Tag>;
        }
        return <Tag color="blue" className="font-medium px-2 py-0.5">Percentage (%)</Tag>;
      },
    },
    {
      title: "Configured Markup / Surcharge",
      key: "markupValue",
      render: (_, record) => {
        if (record.markupType === "fixed") {
          return <span className="font-semibold text-emerald-600">+${Number(record.markupValue || 0).toFixed(2)}</span>;
        }
        if (record.markupType === "formula") {
          return (
            <Tooltip title={`Evaluated on runtime with basePrice: ${record.markupFormula || "N/A"}`}>
              <span className="font-mono text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200 cursor-pointer">
                ƒ: {record.markupFormula || "N/A"}
              </span>
            </Tooltip>
          );
        }
        return <span className="font-semibold text-blue-600">+{record.markupValue || 0}%</span>;
      },
    },
    {
      title: <div className="text-end">Action</div>,
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <div className="flex justify-end items-center">
            <button
              onClick={() => {
                setSingleCategory(record);
                setEditMarkupType(record.markupType || "percentage");
                setEditCategoryModal(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 transition-colors text-white rounded p-1.5 mr-2"
              title="Edit Category & Markup"
            >
              <CiEdit size={18} />
            </button>
            <Popconfirm
              placement="topRight"
              title="Confirm Delete!"
              description="Are you sure you want to delete this category?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDeleteCategory(record?.id)}
            >
              <button
                className="bg-red-500 hover:bg-red-600 transition-colors text-white rounded p-1.5"
                title="Delete Category"
              >
                <MdDeleteOutline size={18} />
              </button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const data = allCategory?.data?.data?.map((cat, i) => {
    return {
      id: cat?._id,
      slno: i + 1,
      category: cat?.category,
      subServiceType: cat?.subServiceType,
      category_spain: cat?.category_spain,
      markupType: cat?.markupType || "percentage",
      markupValue: cat?.markupValue !== undefined ? cat?.markupValue : 0,
      markupFormula: cat?.markupFormula || "",
    };
  });

  // Handle delete category function
  const handleDeleteCategory = (id) => {
    deleteCategory(id)
      .unwrap()
      .then((payload) => toast.success(payload?.message || "Category deleted successfully"))
      .catch((error) => toast.error(error?.data?.message || "Failed to delete category"));
  };

  // Handle create category function
  const handelCreateCategory = (value) => {
    let serviceType = "";
    if (categoryStatus === "Goods" || categoryStatus === "Waste") {
      serviceType = "move";
    } else {
      serviceType = "sell";
    }

    const payloadData = {
      serviceType: serviceType,
      subServiceType: categoryStatus,
      category: value?.category,
      category_spain: value?.category_spain,
      markupType: value?.markupType || "percentage",
      markupValue: Number(value?.markupValue || 0),
      markupFormula: value?.markupType === "formula" ? value?.markupFormula : null,
    };

    createCategory(payloadData)
      .unwrap()
      .then((payload) => {
        toast.success(payload?.message || "Category created successfully!");
        setAddCategoryModal(false);
        addForm.resetFields();
        setAddMarkupType("percentage");
      })
      .catch((error) => toast.error(error?.data?.message || "Failed to create category"));
  };

  // Handle update category function
  const handleUpdate = (value) => {
    const id = singleCategory?.id;
    const payloadData = {
      id: id,
      category: value?.category,
      category_spain: value?.category_spain,
      markupType: value?.markupType || "percentage",
      markupValue: Number(value?.markupValue || 0),
      markupFormula: value?.markupType === "formula" ? value?.markupFormula : null,
    };

    updateCategory(payloadData)
      .unwrap()
      .then((payload) => {
        toast.success(payload?.message || "Category updated successfully!");
        setEditCategoryModal(false);
      })
      .catch((error) => toast.error(error?.data?.message || "Failed to update category"));
  };

  // Set edit category field values when singleCategory changes
  useEffect(() => {
    if (singleCategory) {
      form.setFieldsValue({
        category: singleCategory?.category,
        category_spain: singleCategory?.category_spain,
        markupType: singleCategory?.markupType || "percentage",
        markupValue: singleCategory?.markupValue || 0,
        markupFormula: singleCategory?.markupFormula || "",
      });
      setEditMarkupType(singleCategory?.markupType || "percentage");
    }
  }, [singleCategory, form]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <PageName name={"Category Management"} />

      {/* Feature 7 XM Admin Guidance Card */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <CiCircleInfo className="text-blue-600 text-2xl mt-0.5 flex-shrink-0" />
        <div className="text-sm text-gray-700">
          <p className="font-semibold text-blue-900">Independent Markup Variables by Category (XM Engine)</p>
          <p className="mt-1">
            Configure tailored surcharge & markup rules for each category (e.g. second-hand items, recyclable materials, construction debris, waste disposal, goods) without code modifications. Choose between <strong>Percentage (%)</strong>, <strong>Fixed Amount ($)</strong>, or <strong>Dynamic Formula</strong> evaluated live during bid calculation.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {["Goods", "Waste", "Recyclable materials", "Second-hand items"].map((status) => (
            <button
              key={status}
              onClick={() => setCategoryStatus(status)}
              className={`px-6 py-1.5 rounded-full text-sm font-medium transition-colors ${
                categoryStatus === status
                  ? "bg-black text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div>
          <button
            onClick={() => {
              addForm.resetFields();
              addForm.setFieldsValue({ markupType: "percentage", markupValue: 0 });
              setAddMarkupType("percentage");
              setAddCategoryModal(true);
            }}
            className="flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
          >
            <IoIosAdd size={20} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <Loading type="table" />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            rowKey="id"
          />
        )}
      </div>

      {/* Add Category Modal */}
      <Modal
        open={addCategoryModal}
        onCancel={() => setAddCategoryModal(false)}
        centered
        footer={false}
        width={560}
      >
        <div className="p-2">
          <h1 className="text-xl font-bold text-center mb-1">Add Category</h1>
          <p className="text-center text-xs text-gray-500 mb-6">
            Define category name and independent markup variables for {categoryStatus}
          </p>
          <Form
            layout="vertical"
            onFinish={handelCreateCategory}
            form={addForm}
            initialValues={{ markupType: "percentage", markupValue: 0 }}
          >
            <Form.Item
              label="Category Name (English)"
              name="category"
              rules={[{ required: true, message: "Please enter category name in English!" }]}
            >
              <Input placeholder="e.g. Heavy Construction Debris" />
            </Form.Item>

            <Form.Item
              label="Category Name (Spanish)"
              name="category_spain"
              rules={[{ required: true, message: "Please enter category name in Spanish!" }]}
            >
              <Input placeholder="e.g. Escombros Pesados de Construcción" />
            </Form.Item>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
              <p className="font-semibold text-gray-800 mb-3 text-sm">
                Independent Markup Configuration (Feature 7)
              </p>
              <Form.Item
                label="Markup Calculation Type"
                name="markupType"
                rules={[{ required: true }]}
              >
                <Select
                  onChange={(val) => setAddMarkupType(val)}
                  options={[
                    { value: "percentage", label: "Percentage (%) - e.g. 10% on base bid" },
                    { value: "fixed", label: "Fixed Amount ($) - e.g. $25 flat fee" },
                    { value: "formula", label: "Administration Formula - e.g. basePrice * 0.12 + 5" },
                  ]}
                />
              </Form.Item>

              {addMarkupType === "percentage" && (
                <Form.Item
                  label="Markup Percentage (%)"
                  name="markupValue"
                  rules={[{ required: true, message: "Enter percentage!" }]}
                  extra="This percentage will be added to the partner base price for this category."
                >
                  <InputNumber min={0} max={100} style={{ width: "100%" }} addonAfter="%" />
                </Form.Item>
              )}

              {addMarkupType === "fixed" && (
                <Form.Item
                  label="Fixed Markup Amount ($)"
                  name="markupValue"
                  rules={[{ required: true, message: "Enter fixed amount!" }]}
                  extra="This fixed flat amount will be added to each service under this category."
                >
                  <InputNumber min={0} style={{ width: "100%" }} addonBefore="$" />
                </Form.Item>
              )}

              {addMarkupType === "formula" && (
                <>
                  <Form.Item
                    label="Formula Expression"
                    name="markupFormula"
                    rules={[{ required: true, message: "Enter formula expression!" }]}
                    extra="Use 'basePrice' variable. Example: basePrice * 0.12 + 15"
                  >
                    <Input placeholder="basePrice * 0.12 + 5" />
                  </Form.Item>
                  <Form.Item
                    label="Fallback Percentage (if formula fails)"
                    name="markupValue"
                  >
                    <InputNumber min={0} max={100} style={{ width: "100%" }} addonAfter="%" />
                  </Form.Item>
                </>
              )}
            </div>

            <div className="flex justify-between gap-3 pt-2">
              <button
                type="submit"
                className="w-full bg-black hover:bg-neutral-800 text-white rounded-full py-2 font-medium transition-colors"
              >
                Create Category
              </button>
              <button
                onClick={() => setAddCategoryModal(false)}
                type="button"
                className="border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-full w-full py-2 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        open={editCategoryModal}
        onCancel={() => setEditCategoryModal(false)}
        centered
        footer={false}
        width={560}
      >
        <div className="p-2">
          <h1 className="text-xl font-bold text-center mb-1">Edit Category & Markup</h1>
          <p className="text-center text-xs text-gray-500 mb-6">
            Update category titles and independent markup rules
          </p>
          <Form layout="vertical" onFinish={handleUpdate} form={form}>
            <Form.Item
              label="Category Name (English)"
              name="category"
              rules={[{ required: true, message: "Please enter category name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Category Name (Spanish)"
              name="category_spain"
              rules={[{ required: true, message: "Please enter category Spanish!" }]}
            >
              <Input />
            </Form.Item>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
              <p className="font-semibold text-gray-800 mb-3 text-sm">
                Independent Markup Configuration (Feature 7)
              </p>
              <Form.Item
                label="Markup Calculation Type"
                name="markupType"
                rules={[{ required: true }]}
              >
                <Select
                  onChange={(val) => setEditMarkupType(val)}
                  options={[
                    { value: "percentage", label: "Percentage (%) - e.g. 10% on base bid" },
                    { value: "fixed", label: "Fixed Amount ($) - e.g. $25 flat fee" },
                    { value: "formula", label: "Administration Formula - e.g. basePrice * 0.12 + 5" },
                  ]}
                />
              </Form.Item>

              {editMarkupType === "percentage" && (
                <Form.Item
                  label="Markup Percentage (%)"
                  name="markupValue"
                  rules={[{ required: true, message: "Enter percentage!" }]}
                  extra="This percentage will be added to the partner base price for this category."
                >
                  <InputNumber min={0} max={100} style={{ width: "100%" }} addonAfter="%" />
                </Form.Item>
              )}

              {editMarkupType === "fixed" && (
                <Form.Item
                  label="Fixed Markup Amount ($)"
                  name="markupValue"
                  rules={[{ required: true, message: "Enter fixed amount!" }]}
                  extra="This fixed flat amount will be added to each service under this category."
                >
                  <InputNumber min={0} style={{ width: "100%" }} addonBefore="$" />
                </Form.Item>
              )}

              {editMarkupType === "formula" && (
                <>
                  <Form.Item
                    label="Formula Expression"
                    name="markupFormula"
                    rules={[{ required: true, message: "Enter formula expression!" }]}
                    extra="Use 'basePrice' variable. Example: basePrice * 0.12 + 15"
                  >
                    <Input placeholder="basePrice * 0.12 + 5" />
                  </Form.Item>
                  <Form.Item
                    label="Fallback Percentage (if formula fails)"
                    name="markupValue"
                  >
                    <InputNumber min={0} max={100} style={{ width: "100%" }} addonAfter="%" />
                  </Form.Item>
                </>
              )}
            </div>

            <div className="flex justify-between gap-3 pt-2">
              <button
                type="submit"
                className="w-full bg-black hover:bg-neutral-800 text-white rounded-full py-2 font-medium transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditCategoryModal(false)}
                className="border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-full w-full py-2 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
