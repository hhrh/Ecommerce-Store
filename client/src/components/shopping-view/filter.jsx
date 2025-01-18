import { filterOptions } from "@/config";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Fragment } from "react";

function ProductFilter({filters, handleFilter}) {
    return (
        <div className="bg-background rounded-lg shadow-md">
            <div className="p-4 border-b">
                <h2 className="text-lg font-extrabold">Filters</h2>
            </div>
            <div className="p-4 space-y-4">
                {Object.keys(filterOptions).map((keyItem) => (
                    <Fragment key={ keyItem }>
                        <div>
                            <h3 className="text-base font-bold">{keyItem}</h3>
                            <div className="grid gap-2 mt-2">
                                {filterOptions[keyItem].map((option) => (
                                    <Label key={option.id} className='flex items-center gap-2 font-normal'>
                                        <Checkbox 
                                            checked={
                                                filters && Object.keys(filters).length > 0 &&
                                                filters[keyItem] && filters[keyItem].indexOf(option.id) > -1}
                                        onCheckedChange={()=>handleFilter(keyItem, option.id)} />
                                        {option.label}
                                    </Label>
                                ))}
                            </div>
                        </div>
                        <Separator/>
                    </Fragment>
                ))}
            </div>
        </div>
    );
}

export default ProductFilter;
