import DashboardStats from "@/components/admin-view/dashboard-stats";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { addFeatureImage, getFeatureImages } from "@/store/common/feature-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
    const [images, setImages] = useState([]);
    const [loadingIndexes, setLoadingIndexes] = useState([]); // Track which files are loading
    const {imageList} = useSelector(state=>state.featuredImages)
    const dispatch = useDispatch();
    const {toast} = useToast();

    function handleUploadImage() {
        if(images.length <=0) {
            toast({
                title: "Please upload an image.",
                variant: "destructive"
            })
            return;
        }
        if(loadingIndexes <=0) {
        dispatch(addFeatureImage(images)).then(data=>{
            if(data?.payload?.success) {
                dispatch(getFeatureImages());
                toast({
                    title: "Images uploaded successfully.",
                })
            }
            setImages([]);
        })
    }
    }

    useEffect(()=>{
        dispatch(getFeatureImages());
    }, [dispatch])

    return <div className="border rounded-lg p-4">
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        <DashboardStats />
        <Dialog>
            <DialogTrigger>
                <Button>Upload Homepage Images</Button>
            </DialogTrigger>
            <DialogContent>
                <ProductImageUpload
                    images={images}
                    setImages={setImages}
                    loadingIndexes={loadingIndexes}
                    setLoadingIndexes={setLoadingIndexes}
                />
            <DialogFooter>
                    <Button onClick={handleUploadImage}>Upload</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        <div className="flex flex-col gap-4 mt-5 border rounded-lg min-h-screen">
            {
            imageList && imageList.length > 0
            ? imageList.map(
                (item)=>
                    <img
                    src={item.secureUrl}
                    className="w-full h-[300px] object-cover rounded-t-lg shadow-lg"
                    />
                )
            : null
            }
        </div>
        </div>;
}

export default AdminDashboard;