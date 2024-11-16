import React, { useState, useEffect, useContext } from "react";
import CreateGRRN from "../components/GRRN/CreateGRRN";
import AuthContext from "../AuthContext";

function GRRN() {
  const [showGRRNModal, setGRRNModal] = useState(false);
  const [grrn, setAllGRRNData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    // Fetching Data of All GRRN entries
    const fetchGRRNData = () => {
      fetch(`${process.env.REACT_APP_URL}/api/grrn/get/${authContext.user}`)
        .then((response) => response.json())
        .then((data) => {
          setAllGRRNData(data);
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
    fetchGRRNData();
    fetchProductsData();
    fetchStoresData();
  }, [authContext.user, updatePage]);

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Modal for GRRN Add
  const addGRRNModalSetting = () => {
    setGRRNModal(!showGRRNModal);
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showGRRNModal && (
          <CreateGRRN
            addGRRNModalSetting={addGRRNModalSetting}
            products={products}
            stores={stores}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">GRRN</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addGRRNModalSetting}
              >
                Create GRRN
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
                  Warehouse
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {grrn.map((element, index) => {
                return (
                  <tr key={element._id}>
                    {console.log("Element: ", element)}
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.vendor?.name}
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
                        : element.date}
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

export default GRRN;
