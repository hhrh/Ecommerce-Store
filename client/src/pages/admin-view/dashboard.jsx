import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common/feature-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageData, setuploadedImageData] = useState(null);
    const [loadingIndexes, setLoadingIndexes] = useState([]); // Track which files are loading
    const {imageList} = useSelector(state=>state.featuredImages)
    const dispatch = useDispatch();

    function handleUploadImage() {
        dispatch(addFeatureImage(uploadedImageData)).then(data=>{
            if(data?.payload?.success) {
                dispatch(getFeatureImages());
            }
            setImageFile(null);
            setuploadedImageData('');
        })
    }

    useEffect(()=>{
        dispatch(getFeatureImages());
    }, [dispatch])

    return <div>
        <ProductImageUpload
            loadingIndexes={loadingIndexes}
            setLoadingIndexes={setLoadingIndexes}
        />
        <Button onClick={handleUploadImage} className="mt-5 w-full">Upload</Button>
        <div className="flex flex-col gap-4 mt-5">
            {
            imageList && imageList.length > 0
            ? imageList.map(
                (item)=>
                    <img
                    src={item.image}
                    className="w-full h-[300px] object-cover rounded-t-lg shadow-lg"
                    />
                )
            : null
            }
        </div>
        </div>;
}

export default AdminDashboard;