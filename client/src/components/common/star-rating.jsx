import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRating({rating, handleChangeRating}) {
    return ( 
    [1,2,3,4,5].map(star=>
        <Button className={`p-2 rounded-full transition-colors ${star <= rating ? 'text-yellow-500 hover:bg-black': 'text-black hover:bg-primary hover:text-primary-foreground'}`}
        variant="outline"
        size="icon"
        onClick={handleChangeRating ? ()=> handleChangeRating(star) : null}>
            <StarIcon className={`w-6 h-6 ${star <= rating ? 'fill-yellow-300 text-yellow-500' : 'fill-black'}`}/>
    </Button>) );
}

export default StarRating;