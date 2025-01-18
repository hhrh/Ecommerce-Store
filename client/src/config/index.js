export const registerFormControls = [
    {
        name : 'userName',
        label : 'User Name',
        placeholder : 'Enter your username',
        componentType : 'input',
        type : 'text'
    },
    {
        name : 'email',
        label : 'Email',
        placeholder : 'Enter your email',
        componentType : 'input',
        type : 'email'
    },
    {
        name : 'password',
        label : 'Password',
        placeholder : 'Enter your password',
        componentType : 'input',
        type : 'password'
    },
]

export const loginFormControls = [
    {
        name : 'email',
        label : 'Email',
        placeholder : 'Enter your email',
        componentType : 'input',
        type : 'email'
    },
    {
        name : 'password',
        label : 'Password',
        placeholder : 'Enter your password',
        componentType : 'input',
        type : 'password'
    },
];

export const addProductFormElements = [
    {
      label: "Title",
      name: "title",
      componentType: "input",
      type: "text",
      placeholder: "Enter product title",
    },
    {
      label: "Description",
      name: "description",
      componentType: "textarea",
      placeholder: "Enter product description",
    },
    {
      label: "Category",
      name: "category",
      componentType: "select",
      options: [
        { id: "men", label: "Men" },
        { id: "women", label: "Women" },
        { id: "kids", label: "Kids" },
        { id: "accessories", label: "Accessories" },
        { id: "footwear", label: "Footwear" },
      ],
    },
    {
      label: "Brand",
      name: "brand",
      componentType: "select",
      options: [
        { id: "nike", label: "Nike" },
        { id: "adidas", label: "Adidas" },
        { id: "puma", label: "Puma" },
        { id: "levi", label: "Levi's" },
        { id: "zara", label: "Zara" },
        { id: "h&m", label: "H&M" },
      ],
    },
    {
      label: "Price",
      name: "price",
      componentType: "input",
      type: "number",
      placeholder: "Enter product price",
    },
    {
      label: "Sale Price",
      name: "salePrice",
      componentType: "input",
      type: "number",
      placeholder: "Enter sale price (optional)",
    },
    {
      label: "Total Stock",
      name: "totalStock",
      componentType: "input",
      type: "number",
      placeholder: "Enter total stock",
    },
];

export const shoppingViewHeaderItems = [
    {
        id: "home",
        label: "Home",
        path: "/shop/home",
    },
    {
        id: "all",
        label: "All",
        path: "/shop/listing",
    },
    {
        id: "men",
        label: "Men",
        path: "/shop/listing",
    },
    {
        id: "women",
        label: "Women",
        path: "/shop/listing",
    },
    {
        id: "kids",
        label: "Kids",
        path: "/shop/listing",
    },
    {
        id: "accessories",
        label: "Accessories",
        path: "/shop/listing",
    },
    {
        id: "footwear",
        label: "Footwear",
        path: "/shop/listing",
    },
    {
        id: "search",
        label: "Search",
        path: "/shop/search",
    },
];

export const filterOptions = {
    category: [
        { id: "men", label: "Men" },
        { id: "women", label: "Women" },
        { id: "kids", label: "Kids" },
        { id: "accessories", label: "Accessories" },
        { id: "footwear", label: "Footwear" },
    ],
    brand: [
        { id: "nike", label: "Nike" },
        { id: "adidas", label: "Adidas" },
        { id: "puma", label: "Puma" },
        { id: "levi", label: "Levi's" },
        { id: "zara", label: "Zara" },
        { id: "h&m", label: "H&M" },
    ],
};

export const sortOptions = [
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
    { id: "title-atoz", label: "Title: A to Z" },
    { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
    {
        label: "First name",
        name: "firstName",
        componentType: "input",
        type: "text",
        placeholder: "Enter your first name",
    },
    {
        label: "Last name",
        name: "lastName",
        componentType: "input",
        type: "text",
        placeholder: "Enter your last name",
    },
    {
        label: "Address",
        name: "address",
        componentType: "input",
        type: "text",
        placeholder: "Enter your address",
    },
    {
        label: "Apt., Suite, Unit, etc. (optional)",
        name: "aptSuite",
        componentType: "input",
        type: "text",
        placeholder: "Enter your Apt., Suite, Unit, etc.",
    },
    {
        label: "City",
        name: "city",
        componentType: "input",
        type: "text",
        placeholder: "Enter your city",
    },
    {
        label: "State/Province",
        name: "state",
        componentType: "input",
        type: "text",
        placeholder: "Enter your state",
    },
    {
        label: "Country",
        name: "country",
        componentType: "input",
        type: "text",
        placeholder: "Enter your country",
    },
    {
        label: "Zip code",
        name: "zipcode",
        componentType: "input",
        type: "text",
        placeholder: "Enter your zip code",
    },
    {
        label: "Phone",
        name: "phone",
        componentType: "input",
        type: "text",
        placeholder: "Enter your phone number",
    },
    {
        label: "Notes (optional)",
        name: "notes",
        componentType: "textarea",
        placeholder: "Enter any additional notes",
    },
];
