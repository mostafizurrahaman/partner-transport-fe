import React, { useEffect, useState } from "react";
import PageName from "../../Components/Shared/PageName";
import { IoIosAdd } from "react-icons/io";
import { Checkbox, Form, Input, Modal, Popconfirm, Table } from "antd";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import {
  useCrateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from "../../redux/api/categoryManagementApi";
import { toast } from "sonner";
import Loading from '../../Components/Loading/Loading';

const CategoryManagement = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm(); 
  const [categoryStatus, setCategoryStatus] = useState("Waste");
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [singleCategory, setSingleCategory] = useState("");

  // category management api
  const [createCategory] = useCrateCategoryMutation();
  const { data: allCategory, isLoading } = useGetCategoryQuery(categoryStatus);
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  // console.log(singleCategory);

  const columns = [
    {
      title: "SL no.",
      dataIndex: "slno",
      key: "slno",
    },
    {
      title: "Category Name English",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Category Name Spain",
      dataIndex: "category_spain",
      key: "category_spain",
    },
    {
      title: <div className="text-end">Action</div>,
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditCategoryModal(true);
                setSingleCategory(record);
              }}
              className="bg-blue-500 text-white rounded-sm p-1 mr-2"
            >
              <CiEdit size={20} />
            </button>
            <Popconfirm
              placement="topRight"
              title="Confirm Delete!"
              description="Are you sure you want to delete this item?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDeleteCategory(record?.id)}
            >
              <button
                onClick={() => (
                  <Popconfirm
                    placement="leftTop"
                    title={"Confirm Delete"}
                    // description={description}
                    okText="Yes"
                    cancelText="No"
                  ></Popconfirm>
                )}
                className="bg-red-500 text-white rounded-sm p-1"
              >
                <MdDeleteOutline size={20} />
              </button>
            </Popconfirm>
            {/* <button className='bg-red-500 text-white rounded-sm p-1'><MdDeleteOutline size={20} /></button> */}
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
      category_spain : cat?.category_spain
    };
  });


  // ------Handle delete category function -----//
  const handleDeleteCategory = (id) => {
    deleteCategory(id)
      .unwrap()
      .then((payload) => toast.success(payload?.message))
      .catch((error) => toast.error(error?.data?.message));
  };

  // ---- handle create category function--------//
  const handelCreateCategory = (value) => {
    let serviceType = "";
    if (categoryStatus === "Goods" || categoryStatus === "Waste") {
      serviceType = "move";
    } else {
      serviceType = "sell";
    }


    const data = {
      serviceType: serviceType,
      subServiceType: categoryStatus,
      category: value?.category,
      category_spain : value?.category_spain
      // ...(value?.isSpanish && { category_spain: "category_spain" })
    };

    createCategory(data)
      .unwrap()
      .then((payload) => {
        toast.success(payload?.message);
        setAddCategoryModal(false);
        addForm.resetFields("");
      })
      .catch((error) => toast.error(error?.data?.message));
  };

  //---handle update category function
  const handleUpdate = (value) => {
    const id = singleCategory?.id;
    const data = {
      id: id,
      category: value?.category,
      category_spain :  value?.category_spain
    };
    updateCategory(data)
      .unwrap()
      .then((payload) => {
        toast.success(payload?.message);
        setEditCategoryModal(false);
      })
      .catch((error) => toast.error(error?.data?.message));
  };

  // Set edit category field item
  useEffect(() => {
    form.setFieldsValue({
      category: singleCategory?.category,
      category_spain : singleCategory?.category_spain

    });
  }, [singleCategory, form]);


  return (
    <div className="bg-white p-5">
      <PageName name={"Category Management"} />
      <div className="mt-5 flex items-center justify-between ">
        <div className="flex items-center gap-2  px-2">
          <div
            onClick={() => setCategoryStatus("Goods")}
            className={`border px-8 py-1 border-black rounded-full cursor-pointer ${
              categoryStatus === "Goods" ? "bg-black text-white" : ""
            }`}
          >
            Goods
          </div>
          <div
            onClick={() => setCategoryStatus("Waste")}
            className={`border px-8 py-1 border-black rounded-full cursor-pointer ${
              categoryStatus === "Waste" ? "bg-black text-white" : ""
            }`}
          >
            Waste
          </div>
          <div
            onClick={() => setCategoryStatus("Recyclable materials")}
            className={`border px-8 py-1 border-black rounded-full cursor-pointer ${
              categoryStatus === "Recyclable materials"
                ? "bg-black text-white"
                : ""
            }`}
          >
            Recyclable Material
          </div>
          <div
            onClick={() => setCategoryStatus("Second-hand items")}
            className={`border px-8 py-1 border-black rounded-full cursor-pointer ${
              categoryStatus === "Second-hand items"
                ? "bg-black text-white"
                : ""
            }`}
          >
            Second-hand items
          </div>
        </div>
        <div>
          <button
            onClick={() => setAddCategoryModal(true)}
            className="items-center flex gap-2 bg-black text-white px-5 py-2 rounded-full"
          >
            <IoIosAdd size={20} />
            <span>Add</span>
          </button>
        </div>
      </div>
      <div className="mt-5 mx-auto max-w-7xl">
        {isLoading ? <Loading type="table" /> : <Table columns={columns} dataSource={data} pagination={false} />}
      </div>
      {/* Edit Category modal */}
      <Modal
        open={addCategoryModal}
        onCancel={() => setAddCategoryModal(false)}
        centered
        footer={false}
      >
        <div>
          <h1 className="text-xl font-medium text-center mb-5">
            Add Category{" "}
          </h1>
          <Form layout="vertical" onFinish={handelCreateCategory} form={addForm}>
            <Form.Item
              className="w-full"
              label="Category Name English"
              name="category"
              rules={[
                { required: true, message: "Please enter category name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="w-full"
              label="Category Name Spanish"
              name="category_spain"
              rules={[
                { required: true, message: "Please enter category Spanish!" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Checkbox for Spanish Language */}
            {/* <Form.Item name="isSpanish" valuePropName="checked">
              <Checkbox>Spanish Language</Checkbox>
            </Form.Item> */}
            <div className="flex justify-between gap-3">
              <Form.Item className="w-full">
                <button className="w-full bg-black text-white rounded-full  py-2">
                  Save
                </button>
              </Form.Item>
              <Form.Item className="w-full">
                <button
                  onClick={() => setAddCategoryModal(false)}
                  type="button"
                  className=" border border-black text-black rounded-full w-full p-1 "
                >
                  Cancel
                </button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Update category modal */}
      <Modal
        open={editCategoryModal}
        onCancel={() => setEditCategoryModal(false)}
        centered
        footer={false}
      >
        <div>
          <h1 className="text-xl font-medium text-center mb-5">
            Edit Category{" "}
          </h1>
          <Form layout="vertical" onFinish={handleUpdate} form={form}>
            <Form.Item
              className="w-full"
              name="category"
              label="Category Name"
              rules={[
                { required: true, message: "Please enter category name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="w-full"
              label="Category Name Spanish"
              name="category_spain"
              rules={[
                { required: true, message: "Please enter category Spanish!" },
              ]}
            >
              <Input />
            </Form.Item>
            <div className="flex justify-between gap-3">
              <Form.Item className="w-full">
                <button
                  type="submit"
                  className="w-full bg-black text-white rounded-full py-2"
                >
                  Update
                </button>
              </Form.Item>

              <Form.Item className="w-full">
                <button
                  type="button"
                  onClick={() => setEditCategoryModal(false)}
                  className=" border border-black text-black rounded-full w-full p-1 "
                >
                  Cancel
                </button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
