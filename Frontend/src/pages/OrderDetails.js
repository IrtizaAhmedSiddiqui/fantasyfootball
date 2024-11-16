import React, { Fragment, useState, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AddOrderDetails from "../components/Order/AddOrderDetails";
import AuthContext from "../AuthContext";
import jsPDFInvoiceTemplate, { OutputType } from "jspdf-invoice-template";

function OrderDetails() {
  const localStorageData = JSON.parse(localStorage.getItem("user"));
  const [showOrderModal, setOrderModal] = useState(false);
  const [orders, setAllOrdersData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  let [isCompleteOpen, setIsCompleteOpen] = useState(false);
  let [isCancelOpen, setIsCancelOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const authContext = useContext(AuthContext);

  useEffect(() => {
    // Fetching Data of All Order items
    const fetchOrderData = () => {
      fetch(`${process.env.REACT_APP_URL}/api/order/get/${authContext.user}`)
        .then((response) => response.json())
        .then((data) => {
          setAllOrdersData(data);
        })
        .catch((err) => console.log(err));
    };

    // Fetching Data of All Products
    const fetchProductsData = () => {
      fetch(`${process.env.REACT_APP_URL}/api/product/get/${authContext.user}`)
        .then((response) => response.json())
        .then((data) => {
          setAllProducts(data);
        })
        .catch((err) => console.log(err));
    };

    // Fetching Data of All Stores
    const fetchStoresData = () => {
      fetch(`${process.env.REACT_APP_URL}/api/store/get/${authContext.user}`)
        .then((response) => response.json())
        .then((data) => {
          setAllStores(data);
        })
        .catch((err) => console.log(err));
    };
    fetchOrderData();
    fetchProductsData();
    fetchStoresData();
  }, [authContext.user, updatePage]);

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Modal for Sale Add
  const addSaleModalSetting = () => {
    setOrderModal(!showOrderModal);
  };

  function openCompleteModal(id) {
    setOrderId(id);
    setIsCompleteOpen(true);
  }

  function closeCompleteModal() {
    setIsCompleteOpen(false);
  }

  function closeCancelModal() {
    setIsCancelOpen(false);
  }

  function openCancelModal(id) {
    setOrderId(id);
    setIsCancelOpen(true);
  }

  const generatePDF = (id) => {
    const order = orders.filter((element) => element._id === id);
    const date = new Date().toJSON().slice(0, 10);
    order.map((element, index) => {
      const prop = {
        outputType: OutputType.Save,
        returnJsPDFDocObject: true,
        fileName: "Invoice",
        orientationLandscape: true,
        compress: true,
        logo: {
          src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png",
          type: "PNG", //optional, when src= data:uri (nodejs case)
          width: 53.33, //aspect ratio = width/height
          height: 26.66,
          margin: {
            top: 0, //negative or positive num, from the current position
            left: 0, //negative or positive num, from the current position
          },
        },
        stamp: {
          inAllPages: true, //by default = false, just in the last page
          src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg",
          type: "JPG", //optional, when src= data:uri (nodejs case)
          width: 20, //aspect ratio = width/height
          height: 20,
          margin: {
            top: 0, //negative or positive num, from the current position
            left: 0, //negative or positive num, from the current position
          },
        },
        business: {
          name: "Mads International",
          address: "Eros Complex",
        },

        invoice: {
          label: `Invoice #: 1`,
          invDate: `Order Date: ${element.orderDate}`,
          invGenDate: `Invoice Date: ${date}`,
          headerBorder: false,
          tableBodyBorder: false,
          header: [
            {
              title: "ID",
              style: {
                width: 15,
              },
            },
            {
              title: "Vendor",
              style: {
                width: 25,
              },
            },
            {
              title: "Item",
              style: {
                width: 30,
              },
            },
            {
              title: "Pack Size",
              style: {
                width: 20,
              },
            },
            {
              title: "Quantity",
              style: {
                width: 20,
              },
            },
            {
              title: "Warehouse",
              style: {
                width: 60,
              },
            },
            {
              title: "Payment Method",
              style: {
                width: 30,
              },
            },
            {
              title: "Rider",
              style: {
                width: 20,
              },
            },
            {
              title: "Order By",
              style: {
                width: 30,
              },
            },
            {
              title: "Price(Rs)",
              style: {
                width: 20,
              },
            },
          ],
          table: element.products?.map((product, index) => [
            element.code,
            element.StoreID?.name,
            product.product.items.name,
            `${product.product.packSize.packSize} ${product.product.items.units}`,
            product.stockOrdered,
            `${product.product.city}, ${product.product.area}, Warehouse ${product.product.warehouseNumber}`,
            element.paymentMethod,
            element.riderName,
            `${element.userID?.firstName} ${element.userID?.lastName}`,
            product.price,
          ]),

          additionalRows: [
            {
              col1: "Total:",
              col2: `Rs. ${element.totalAmount}`,
              style: {
                fontSize: 14, //optional, default 12
              },
            },
          ],
          invDescLabel: "Invoice Note",
          invDesc:
            "Invoice Generated Successfully. This invoice should be kept safely such that it is not lost. By placing this order you are agreeing to pay the amount generated as mentioned above.",
        },
        footer: {
          text: "The invoice is created on a computer and is valid without the signature and stamp.",
        },
        pageEnable: true,
        pageLabel: "Page ",
      };
      return jsPDFInvoiceTemplate(prop);
    });
  };

  const resolveItem = (id) => {
    fetch(`${process.env.REACT_APP_URL}/api/order/post/${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((result) => {
        alert("Order Completed");
        handlePageUpdate();
      })
      .catch((err) => console.log(err));
  };

  const cancelOrder = (id) => {
    fetch(`${process.env.REACT_APP_URL}/api/order/post/cancel/${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((result) => {
        alert("Order Cancelled");
        handlePageUpdate();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showOrderModal && (
          <AddOrderDetails
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            stores={stores}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        <Transition appear show={isCompleteOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={closeCompleteModal}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Order Delivered
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Mark Order as Completed?
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mr-2"
                        onClick={() => {
                          closeCompleteModal();
                          resolveItem(orderId);
                        }}
                      >
                        Yes
                      </button>

                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeCompleteModal}
                      >
                        No
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
        <Transition appear show={isCancelOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeCancelModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Cancel Order
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to Canel this Order?
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mr-2"
                        onClick={() => {
                          closeCancelModal();
                          cancelOrder(orderId);
                        }}
                      >
                        Yes
                      </button>

                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeCancelModal}
                      >
                        No
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3 items-center">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Order Details</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addSaleModalSetting}
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  ID
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Vendor
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Pack Size
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Quantity
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Price(Rs)
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Warehouse
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Order Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Total(Rs)
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Payment Method
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Rider
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Order By
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  More
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {orders.map((element, index) => {
                return (
                  <tr key={element._id}>
                    {console.log("Element: ", element)}
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.code}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.StoreID?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.products.map((product) => {
                        return <p>{product.product.items.name}</p>;
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.products.map((product) => {
                        return (
                          <p>
                            {product.product.packSize.packSize}
                            {product.product.items.units}
                          </p>
                        );
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.products.map((product) => {
                        return <p>{product.stockOrdered}</p>;
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.products.map((product) => {
                        return <p>{product.price}</p>;
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.products.map((product) => {
                        return (
                          <p>
                            {product.product.city}, {product.product.area},
                            Warehouse {product.product.warehouseNumber}
                          </p>
                        );
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {new Date(element.PurchaseDate).toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? "Today"
                        : element.orderDate}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.totalAmount}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.paymentMethod}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.riderName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.userID?.firstName} {element.userID?.lastName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                        className="text-green-700 cursor-pointer"
                        onClick={() => openCompleteModal(element._id)}
                      >
                        Complete
                      </span>

                      <span
                        className="text-red-600 px-2 cursor-pointer"
                        onClick={() => openCancelModal(element._id)}
                      >
                        {localStorageData.firstName === "Azhar" ? "Cancel" : ""}
                      </span>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mr-2"
                        onClick={() => generatePDF(element._id)}
                      >
                        Generate Invoice
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
