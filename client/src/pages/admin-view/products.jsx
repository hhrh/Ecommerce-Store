import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialState = {
    images: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
    avgReview: 0,
  };

function AdminProducts() {
  const [openCreateProducts, setOpenCreateProducts] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [loadingIndexes, setLoadingIndexes] = useState([]);
  const [images, setImages] = useState([]);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [finalizedTitle, setFinalizedTitle] = useState("");
    const {productList} = useSelector(state=>state.adminProducts);
    const {toast} = useToast();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(fetchAllProducts());
    }, [dispatch]);

    function handleDelete(getCurrentProductId) {
        dispatch(deleteProduct(getCurrentProductId)).then(data=>{
            if(data?.payload?.success) {
                dispatch(fetchAllProducts());
                toast({
                  title: "Product deleted successfully"
                })
            }
        })
    }

  function isFormValid() {
    console.log(formData)
    return (
      loadingIndexes &&
      formData.title.trim() !== "" && // Title should not be empty
      formData.description.trim() !== "" && // Description should not be empty
      formData.category.trim() !== "" && // Category should not be empty
      formData.brand.trim() !== "" && // Brand should not be empty
      /^[0-9]+(\.[0-9]{1,2})?$/.test(formData.price) && // Price should be a valid number with up to 2 decimals
      ///^[0-9]+(\.[0-9]{1,2})?$/.test(formData.salePrice) && // Sale Price: same as price
      /^\d+$/.test(formData.totalStock) // Total Stock should be a whole number
    );
  }

    function onSubmit(event) {
        event.preventDefault();

        if(currentEditedId){
            dispatch(editProduct({
                id: currentEditedId,
                formData
            })).then(data=>{
                console.log(data, "EDITT")
                if(data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setOpenCreateProducts(false);
                    setFormData(initialState);
                    setCurrentEditedId(null);
                    setFinalizedTitle(formData.title);
                    toast({
                        title: "Product edited."
                    })
                }
            })
        } else {
          if (images.length <= 0) {
            toast({
              title: "Please upload a product image.",
              variant: 'destructive'
            })
            return;
          }
          dispatch(addNewProduct({
                ...formData,
                images: images,
            })).then((data)=>{
                console.log(data);
                if(data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setOpenCreateProducts(false);
                    setImages([]);
                    setFormData(initialState);
                    setFinalizedTitle(formData.title);
                    toast({
                        title: "Product added successfully."
                    })
                }
        })
        }
    }

    return (
      <div className="p-5 rounded-lg shadow-md border">
        <div className="mb-5 w-full flex flex-col justify-between">
          <div className="flex justify-between">
          <h1 className="text-2xl font-semibold mb-2">Products</h1>
            <p className="text-muted-foreground">{productList.length || 0} Products</p>
          </div>
          <Button onClick={() => setOpenCreateProducts(true)}>
            Add New Product
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-3 border rounded-lg min-h-screen">
          {productList && productList.length > 0
            ? productList.map((productItem, i) => (
                <AdminProductTile
                  key={i}
                  setFormData={setFormData}
                  setOpenCreateProducts={setOpenCreateProducts}
                  setCurrentEditedId={setCurrentEditedId}
                  product={productItem}
                  handleDelete={handleDelete}
                />
              ))
            : null}
        </div>
        <Sheet
          open={openCreateProducts}
          onOpenChange={() => {
            setOpenCreateProducts(false);
            setCurrentEditedId(null);
            setFormData(initialState);
          }}
        >
          <SheetContent side="right" className="overflow-auto">
            <SheetHeader>
              <SheetTitle>
                {currentEditedId
                  ? "Edit existing product"
                  : "Add a new product"}
                <SheetDescription className="text-blue-400">
                  {currentEditedId ? finalizedTitle : null}
                </SheetDescription>
              </SheetTitle>
            </SheetHeader>
            <ProductImageUpload
              images={images}
              setImages={setImages}
              loadingIndexes={loadingIndexes}
              setLoadingIndexes={setLoadingIndexes}
            />
            <div className="py-6">
              <CommonForm
                formData={formData}
                setFormData={setFormData}
                formControls={addProductFormElements}
                buttonText={currentEditedId ? "Edit" : "Add"}
                onSubmit={onSubmit}
                isBtnDisabled={!isFormValid()}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
}

export default AdminProducts;