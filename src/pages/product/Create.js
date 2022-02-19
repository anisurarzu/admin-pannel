import React, { useState, useCallback, useEffect } from "react";
import "./style.scss";
import Select from "react-select";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";
import { Icon } from "react-icons-kit";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import CreatableSelect from "react-select/creatable";
import { chevronLeft, plus } from "react-icons-kit/feather";
import { Container } from "../../components/container";
import { Card } from "../../components/card/Index";

import ProductMaterialInputs from "../../components/form/product/Material";
import ProductAdditionalInputs from "../../components/form/product/Additional";
import DescriptionInput from "../../components/form/product/Description";
import ReturnPolicy from "../../components/form/product/ReturnPolicy";
import Warranty from "../../components/form/product/Warranty";
import Emi from "../../components/form/product/Emi";

import Requests from "../../utils/Requests/Index";

toast.configure({ autoClose: 2000 });
const Create = () => {
  const { register, handleSubmit, setError, clearErrors, errors } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [brands, setBrands] = useState([]);

  const [categories, setCategories] = useState({
    options: [],
    value: null,
    error: null,
  });
  const [subCategories, setSubCategories] = useState({
    options: [],
    value: null,
  });
  const [leafCategories, setLeafCategories] = useState({
    options: [],
    value: null,
  });

  const [header] = useState({
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  // Input states
  const [vendor, setVendor] = useState({ value: null, error: null });
  const [brand, setBrand] = useState(null);

  const [isTrending, setTrending] = useState(false);
  const [newArrivals, setNewArrivals] = useState(false);
  const [bestSale, setBestSale] = useState(false);
  const [tags, setTags] = useState({ value: [], error: null });

  const [thumbnail, setThumbnail] = useState({
    value: null,
    preview: null,
    error: null,
  });
  const [additinalImages, setAdditionalImages] = useState({
    values: null,
    previews: null,
    error: null,
  });

  const [material, setMaterial] = useState(null);
  const [additional, setAdditional] = useState(null);
  const [returnReplace, setReturnReplace] = useState({
    status: null,
    limit: null,
    description: null,
    limitError: false,
  });
  const [warranty, setWarranty] = useState({
    status: null,
    day: null,
    month: null,
    year: null,
    description: null,
    error: false,
  });
  const [emiData, setEmiData] = useState({ amount: null, duration: null });
  const [description, setDescription] = useState(null);

  // Get Data
  const getData = useCallback(async () => {
    const response = await Requests.Options.Index(header);
    if (response) {
      setCategories((exCategory) => ({
        ...exCategory,
        options: response.mainCategories,
      }));
      setBrands(response.brands);
      setVendors(response.vendors);
    }
  }, [header]);

  useEffect(() => {
    getData();
  }, [header, getData]);

  // Handle vendor
  const handleVendor = (event) =>
    setVendor({ value: event.value, error: null });

  // Handle brand
  const handleBrand = (event) => setBrand(event.value);

  // Handle main category
  const handleMainCategory = (event) => {
    const value = event.value;
    const children = event.child;

    setCategories((exCategory) => ({ ...exCategory, value: value }));

    if (children && children.length) {
      setSubCategories((exChildren) => ({ ...exChildren, options: children }));
    } else {
      setSubCategories((exChildren) => ({
        ...exChildren,
        options: [],
      }));
    }
  };

  // Handle sub category
  const handleSubCategory = (event) => {
    const value = event.value;
    const children = event.child;

    setSubCategories((exSubCategory) => ({ ...exSubCategory, value: value }));

    if (children && children.length) {
      setLeafCategories((exChildren) => ({ ...exChildren, options: children }));
    } else {
      setLeafCategories((exChildren) => ({
        ...exChildren,
        options: [],
      }));
    }
  };

  // Handle leaf category
  const handleLeafCategory = (event) => {
    const value = event.value;
    setLeafCategories((exLeafCategory) => ({
      ...exLeafCategory,
      value: value,
    }));
  };

  // Handle trending checkbox
  const handleTrendingCheckBox = (event) => {
    const item = event.target;
    if (item.checked === true) {
      setTrending(true);
    } else {
      setTrending(false);
    }
  };

  // Handle new arrival checkbox
  const handleNewArrivalCheckBox = (event) => {
    const item = event.target;
    if (item.checked === true) {
      setNewArrivals(true);
    } else {
      setNewArrivals(false);
    }
  };

  // Handle best sale checkbox
  const handleBestSaleCheckBox = (event) => {
    const item = event.target;
    if (item.checked === true) {
      setBestSale(true);
    } else {
      setBestSale(false);
    }
  };

  // Handle tags
  const handleTags = (event) => setTags({ value: event, error: null });

  // Thumbnail handeller
  const thumbnailHandeller = (event) => {
    let file = event.target.files[0];
    if (file) {
      const size = parseInt(file.size) / 1000;
      if (size > 700) {
        setThumbnail({ ...thumbnail, error: "Select less than 700KB file." });
        return;
      }
      setThumbnail({
        value: file,
        preview: URL.createObjectURL(file),
        error: null,
      });
    }
  };

  // Additinal Image handeller
  const additionalImageHandeller = (event) => {
    let size = 0;
    let fileArray = [];
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      fileArray.push(URL.createObjectURL(files[i]));
      size += files[i].size;
    }

    if (fileArray.length < 2) {
      setAdditionalImages({
        ...additinalImages,
        error: "Select more than 2 files.",
      });
      return;
    } else if (parseInt(size / 1000) > 8192) {
      setAdditionalImages({
        ...additinalImages,
        error: "Total size limit is 8MB",
      });
      return;
    }
    setAdditionalImages({ values: files, previews: fileArray, error: null });
  };

  // get materials data
  const getMaterials = (data) => setMaterial(data);

  // get additional data
  const getAdditional = (data) => setAdditional(data);

  // get description
  const getDescription = (data) => setDescription(data);

  // Handle return & replacement
  const handleReturnReplacement = (data) => {
    if (data.status) {
      setReturnReplace({ ...returnReplace, status: data.status });
    } else {
      setReturnReplace({
        status: null,
        limit: null,
        description: null,
        limitError: null,
      });
    }
    if (data.limit)
      setReturnReplace({
        ...returnReplace,
        limit: data.limit,
        limitError: null,
      });
    if (data.description)
      setReturnReplace({ ...returnReplace, description: data.description });
  };

  // Handle warranty
  const handleWarranty = (data) => {
    if (data.status) {
      setWarranty({ ...warranty, status: data.status });
    } else {
      setWarranty({
        status: null,
        day: null,
        month: null,
        year: null,
        description: null,
        error: false,
      });
    }
    if (data.day) setWarranty({ ...warranty, day: data.day, error: null });
    if (data.month)
      setWarranty({ ...warranty, month: data.month, error: null });
    if (data.year) setWarranty({ ...warranty, year: data.year, error: null });
    if (data.description)
      setWarranty({ ...warranty, description: data.description });
  };

  // Handle EMI
  const handleEMI = (data) => {
    if (data.amount) setEmiData({ ...emiData, amount: data.amount });
    if (data.duration) setEmiData({ ...emiData, duration: data.duration });
  };

  // Submit Data
  const onSubmit = async (data) => {
    if (!vendor.value)
      return setVendor({ value: null, error: "Vendor is required" });
    if (!categories.value) {
      setCategories((exCategory) => ({
        ...exCategory,
        value: null,
        error: "Main category is required",
      }));
      return;
    }
    if (!tags.value.length)
      return setTags({ value: null, error: "Tags is required" });
    if (returnReplace.status && !returnReplace.limit)
      return setReturnReplace({ ...returnReplace, limitError: true });
    // if (warranty.status) {
    //     if (!(warranty.day) || !(warranty.month) || !(warranty.year)) return setWarranty({ ...warranty, error: true })
    // }

    if (!thumbnail.value)
      return setThumbnail({ ...thumbnail, error: "Thumbnail is required." });

    // if (!additinalImages.values) return setAdditionalImages({ values: null, error: "Additional image is required" })
    if (additinalImages.values && additinalImages.values.length < 2)
      return setAdditionalImages({
        values: null,
        error: "Minimum 2 image required",
      });

    if (parseInt(data.salePrice) <= parseInt(data.purchasePrice)) {
      return setError("salePrice", {
        type: "manual",
        message: "Sale price must be greater than purchase price",
      });
    } else {
      clearErrors("salePrice");
    }

    const product = {
      ...data,
      brand: brand || null,
      isTrending,
      newArrivals,
      bestSale,
      vendor: vendor.value || null,
      mainCategory: categories.value || null,
      subCategory: subCategories.value || null,
      leafCategory: leafCategories.value || null,
      tags: tags.value && tags.value.map((data) => data.value),
      material: material,
      additional: additional,
      description: description,
      returnReplacement: returnReplace,
      warranty: warranty,
      emi: emiData,
    };

    let formData = new FormData();
    formData.append("name", product.name);
    // formData.append('bn_name',product.bn_name)
    formData.append("brand", JSON.stringify(product.brand));
    formData.append("isTrending", product.isTrending);
    formData.append("newArrivals", product.newArrivals);
    formData.append("bestSale", product.bestSale);
    formData.append("vendor", JSON.stringify(product.vendor));
    formData.append("mainCategory", JSON.stringify(product.mainCategory));
    formData.append("subCategory", JSON.stringify(product.subCategory));
    formData.append("leafCategory", JSON.stringify(product.leafCategory));
    formData.append("tags", JSON.stringify(product.tags));
    formData.append("sku", product.sku);
    formData.append("stockAmount", product.stockAmount);
    formData.append("purchasePrice", product.purchasePrice);
    formData.append("salePrice", product.salePrice);
    formData.append("discountType", product.discountType);
    formData.append("discountAmount", product.discountAmount);
    formData.append("material", JSON.stringify(product.material));
    formData.append("additional", JSON.stringify(product.additional));
    formData.append("description", product.description);
    formData.append("video", product.video);
    formData.append(
      "returnReplacement",
      JSON.stringify(product.returnReplacement)
    );
    formData.append("warranty", JSON.stringify(product.warranty));
    formData.append("emi", JSON.stringify(product.emi));

    // Basic image
    formData.append("image", thumbnail.value);

    // Additional images
    if (additinalImages.values) {
      for (const key of Object.keys(additinalImages.values)) {
        formData.append("images", additinalImages.values[key]);
      }
    }
    // for (const key of Object.keys(additinalImages.values)) {
    //     formData.append('images', additinalImages.values[key])
    // }

    setLoading(true);
    await Requests.Product.Store(formData, header);
    setLoading(false);

    console.log(data, formData);
  };

  return (
    <div className="store-product">
      <Container.Fluid>
        <Container.Row>
          <Container.Column className="col-padding">
            <Card.Simple className="border-0 shadow-sm">
              <Card.Header className="p-3 p-lg-4 bg-white">
                <div className="d-flex">
                  <div>
                    <h6 className="mb-0">Product Information</h6>
                  </div>
                  <div className="ml-auto">
                    <Link
                      to="/dashboard/product"
                      type="button"
                      className="btn shadow-none rounded-circle"
                    >
                      <Icon icon={chevronLeft} size={22} />
                    </Link>
                  </div>
                </div>
              </Card.Header>

              {/* Store form */}
              <Card.Body className="p-lg-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Container.Row>
                    {/* Name */}

                    <Container.Column>
                      <div className="form-group mb-4">
                        {errors.name && errors.name.message ? (
                          <p className="text-danger">
                            {errors.name && errors.name.message}
                          </p>
                        ) : (
                          <p>Product Name(EN)</p>
                        )}

                        <input
                          type="text"
                          name="name"
                          className="form-control shadow-none"
                          placeholder="Enter product title"
                          ref={register({
                            required: "Product name is required",
                          })}
                        />
                      </div>
                    </Container.Column>
                    {/*Product bengali name */}
                    {
                      <Container.Column>
                        <div className="form-group mb-4">
                          {errors.bn_name && errors.bn_name.message ? (
                            <p className="text-danger">
                              {errors.bn_name && errors.bn_name.message}
                            </p>
                          ) : (
                            <p>Product Title (BN)</p>
                          )}

                          <input
                            type="text"
                            name="bn_name"
                            className="form-control shadow-none"
                            placeholder="Enter product bengali title"
                            // ref={register({
                            //     required: "Product name is required"
                            // })}
                          />
                        </div>
                      </Container.Column>
                    }
                    {/* Sub Title */}
                    {
                      <Container.Column>
                        <div className="form-group mb-4">
                          {errors.bn_name && errors.bn_name.message ? (
                            <p className="text-danger">
                              {errors.bn_name && errors.bn_name.message}
                            </p>
                          ) : (
                            <p>Sub Title</p>
                          )}

                          <input
                            type="text"
                            name="bn_name"
                            className="form-control shadow-none"
                            placeholder="Enter product sub title"
                            // ref={register({
                            //     required: "Product name is required"
                            // })}
                          />
                        </div>
                      </Container.Column>
                    }

                    {/* Vendor */}
                    {
                      <Container.Column className="col-lg-4">
                        <div className="form-group mb-4">
                          {errors.bn_name && errors.bn_name.message ? (
                            <p className="text-danger">
                              {errors.bn_name && errors.bn_name.message}
                            </p>
                          ) : (
                            <p>Author Name</p>
                          )}

                          <select
                            name="author name"
                            className="form-control shadow-none"
                            ref={register()}
                          >
                            <option value="">Select type</option>
                            <option value="buy_now">Author</option>
                            <option value="pre_order">Brand</option>
                          </select>
                        </div>
                      </Container.Column>
                    }
                    {
                      <Container.Column className="col-lg-4">
                        <div className="form-group mb-4">
                          {errors.bn_name && errors.bn_name.message ? (
                            <p className="text-danger">
                              {errors.bn_name && errors.bn_name.message}
                            </p>
                          ) : (
                            <p>Translator Name</p>
                          )}

                          <select
                            name="translator name"
                            className="form-control shadow-none"
                            ref={register()}
                          >
                            <option value="">Select type</option>
                            <option value="buy_now">Author</option>
                            <option value="pre_order">Brand</option>
                          </select>
                        </div>
                      </Container.Column>
                    }
                    {
                      <Container.Column className="col-lg-4">
                        <div className="form-group mb-4">
                          {errors.bn_name && errors.bn_name.message ? (
                            <p className="text-danger">
                              {errors.bn_name && errors.bn_name.message}
                            </p>
                          ) : (
                            <p>Editor Name</p>
                          )}
                          <select
                            name="editor name"
                            className="form-control shadow-none"
                            ref={register()}
                          >
                            <option value="">Select type</option>
                            <option value="buy_now">Author</option>
                            <option value="pre_order">Brand</option>
                          </select>
                        </div>
                      </Container.Column>
                    }

                    {/* Brand */}
                    {
                      <Container.Column>
                        <div className="form-group mb-4">
                          <p>Order Type</p>

                          {/*  <Select
                                                    classNamePrefix="custom-select"
                                                    styles={customStyles}
                                                    placeholder={'Select brand'}
                                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                    options={brands}
                                                    onChange={handleBrand}
                                                /> */}
                          <select
                            name="orderType"
                            className="form-control shadow-none"
                            ref={register()}
                          >
                            <option value="">Select type</option>
                            <option value="buy_now">Buy Now</option>
                            <option value="pre_order">Pre Order</option>
                          </select>
                        </div>
                      </Container.Column>
                    }

                    {/* Main Category */}
                    <Container.Column className="col-lg-4">
                      <div className="form-group mb-4">
                        {categories.error ? (
                          <p className="text-danger">{categories.error}</p>
                        ) : (
                          <p>Category</p>
                        )}

                        <Select
                          classNamePrefix="custom-select"
                          styles={customStyles}
                          placeholder={"Select  category"}
                          components={{
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null,
                          }}
                          options={categories.options}
                          onChange={handleMainCategory}
                        />
                      </div>
                    </Container.Column>

                    {/* Sub Category */}
                    <Container.Column className="col-lg-4">
                      <div className="form-group mb-4">
                        <p>Sub category</p>

                        <Select
                          classNamePrefix="custom-select"
                          styles={customStyles}
                          placeholder={"Select sub category"}
                          components={{
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null,
                          }}
                          options={subCategories.options}
                          onChange={handleSubCategory}
                        />
                      </div>
                    </Container.Column>

                    {/* Leaf Category */}
                    <Container.Column className="col-lg-4">
                      <div className="form-group mb-4">
                        <p>Leaf category</p>

                        <Select
                          classNamePrefix="custom-select"
                          styles={customStyles}
                          placeholder={"Select leaf category"}
                          components={{
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null,
                          }}
                          options={leafCategories.options}
                          onChange={handleLeafCategory}
                        />
                      </div>
                    </Container.Column>

                    {/* language and binding */}
                    {
                      <Container.Column className="col-lg-6">
                        <div className="form-group mb-4">
                          {errors.bn_name && errors.bn_name.message ? (
                            <p className="text-danger">
                              {errors.bn_name && errors.bn_name.message}
                            </p>
                          ) : (
                            <p>Language</p>
                          )}

                          <input
                            type="text"
                            name="bn_name"
                            className="form-control shadow-none"
                            placeholder="Enter language"
                            // ref={register({
                            //     required: "Product name is required"
                            // })}
                          />
                        </div>
                      </Container.Column>
                    }
                    {
                      <Container.Column className="col-lg-6">
                        <div className="form-group mb-4">
                          {errors.bn_name && errors.bn_name.message ? (
                            <p className="text-danger">
                              {errors.bn_name && errors.bn_name.message}
                            </p>
                          ) : (
                            <p>Binding</p>
                          )}

                          <input
                            type="text"
                            name="bn_name"
                            className="form-control shadow-none"
                            placeholder="binding"
                            // ref={register({
                            //     required: "Product name is required"
                            // })}
                          />
                        </div>
                      </Container.Column>
                    }
                  </Container.Row>

                  {/* Pricing */}
                  <Container.Fluid className="pricing-container mb-4">
                    <Container.Row>
                      <Container.Column className="py-3 mb-3 border-bottom">
                        <h6 className="mb-0">Pricing</h6>
                      </Container.Column>

                      {/* Purchase price */}
                      <Container.Column className="col-lg-4">
                        <div className="form-group mb-4">
                          {errors.purchasePrice &&
                          errors.purchasePrice.message ? (
                            <p className="text-danger">
                              {errors.purchasePrice &&
                                errors.purchasePrice.message}
                            </p>
                          ) : (
                            <p>Price</p>
                          )}

                          <input
                            type="number"
                            name="Price"
                            className="form-control shadow-none"
                            placeholder="Enter  price"
                            ref={register({
                              required: "Purchase price is required",
                              pattern: {
                                value: /^\d+$/,
                                message: "Price must be in number.",
                              },
                            })}
                          />
                        </div>
                      </Container.Column>

                      {/* Sale Price */}
                      <Container.Column className="col-lg-4">
                        <div className="form-group mb-4">
                          {errors.salePrice && errors.salePrice.message ? (
                            <p className="text-danger">
                              {errors.salePrice && errors.salePrice.message}
                            </p>
                          ) : (
                            <p>Discount</p>
                          )}

                          <input
                            type="number"
                            name="discount"
                            className="form-control shadow-none"
                            placeholder="Enter discount "
                            ref={register({
                              required: "discount price is required",
                              pattern: {
                                value: /^\d+$/,
                                message: "Price must be in number.",
                              },
                            })}
                          />
                        </div>
                      </Container.Column>

                      {/* Discount Amount */}
                      <Container.Column className="col-lg-4">
                        <div className="form-group mb-4">
                          <p>Discount Amount</p>

                          <input
                            type="number"
                            name="amount"
                            className="form-control shadow-none"
                            placeholder="Enter amount"
                            ref={register()}
                          />
                        </div>
                      </Container.Column>
                    </Container.Row>
                  </Container.Fluid>

                  {/* created by/at */}

                  <Container.Row>
                    {/* created by */}
                    <Container.Column className="col-lg-6">
                      <div className="form-group mb-4">
                        <p>Created By</p>

                        <input
                          type="text"
                          name="created_by"
                          className="form-control shadow-none"
                          placeholder="created by"
                          ref={register()}
                        />
                      </div>
                    </Container.Column>
                    {/* created at */}
                    <Container.Column className="col-lg-6">
                      <div className="form-group mb-4">
                        <p>Created At</p>

                        <input
                          type="text"
                          name="created_at"
                          className="form-control shadow-none"
                          placeholder="created at"
                          ref={register()}
                        />
                      </div>
                    </Container.Column>
                  </Container.Row>

                  {/*  product number and stock manage */}
                  <Container.Row>
                    {/* created by */}
                    <Container.Column className="col-lg-6">
                      <div className="form-group mb-4">
                        <p>Product Number</p>

                        <input
                          type="text"
                          name="product_name"
                          className="form-control shadow-none"
                          placeholder="product number"
                          ref={register()}
                        />
                      </div>
                    </Container.Column>
                    {/* created at */}
                    <Container.Column className="col-lg-6">
                      <div className="form-group mb-4">
                        <p>Stock Manage</p>

                        <input
                          type="text"
                          name="stock_mange"
                          className="form-control shadow-none"
                          placeholder="stock manage"
                          ref={register()}
                        />
                      </div>
                    </Container.Column>
                  </Container.Row>

                  {/* weight ,pon isbn */}
                  <Container.Fluid className="pricing-container mb-4 p-4">
                    <Container.Row>
                      <Container.Column className="col-lg-4">
                        <div className="form-group mb-4">
                          <p>ISBN</p>

                          <input
                            type="text"
                            name="isbn"
                            className="form-control shadow-none"
                            placeholder="ISBN"
                            ref={register()}
                          />
                        </div>
                      </Container.Column>
                      <Container.Column className="col-lg-4">
                        <div className="form-group mb-4">
                          <p>Nop</p>

                          <input
                            type="text"
                            name="number of pages"
                            className="form-control shadow-none"
                            placeholder="number of pages"
                            ref={register()}
                          />
                        </div>
                      </Container.Column>
                      <Container.Column className="col-lg-4">
                        <div className="form-group mb-4">
                          <p>Weight</p>

                          <input
                            type="text"
                            name="discountAmount"
                            className="form-control shadow-none"
                            placeholder="weight"
                            ref={register()}
                          />
                        </div>
                      </Container.Column>
                    </Container.Row>
                  </Container.Fluid>

                  <DescriptionInput data={getDescription} />

                  {/* cover image upload & preview Container */}
                  <div className="d-flex">
                    <div className="row mb-3 mb-lg-4">
                      <div className="col-12">
                        <div>
                          {thumbnail.error ? (
                            <p className="text-danger mb-0 ml-2">
                              {thumbnail.error}
                            </p>
                          ) : (
                            <p className="mb-0 ml-2">Cover Image</p>
                          )}
                        </div>

                        <div className="d-flex">
                          <div className="thumbnail-container">
                            <div className="image border">
                              <input
                                type="file"
                                accept=".jpg, .png, .jpeg"
                                className="upload"
                                onChange={thumbnailHandeller}
                              />
                              <div className="flex-center flex-column">
                                <Icon icon={plus} size={22} />
                              </div>
                            </div>
                          </div>

                          {/* image preview */}
                          {thumbnail.preview ? (
                            <div className="thumbnail-container text-center">
                              <div className="image border">
                                <img
                                  src={thumbnail.preview}
                                  className="img-fluid"
                                  alt="..."
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {/* cover image end */}

                    {/* inside image upload & preview Container */}
                    <div className="row  mb-lg-4">
                      <div className="col-12">
                        <div>
                          {thumbnail.error ? (
                            <p className="text-danger mb-0 ml-2">
                              {thumbnail.error}
                            </p>
                          ) : (
                            <p className="mb-0 ml-2">Look Inside</p>
                          )}
                        </div>

                        <div className="d-flex">
                          <div className="thumbnail-container">
                            <div className="image border">
                              <input
                                type="file"
                                accept=".jpg, .png, .jpeg"
                                className="upload"
                                onChange={thumbnailHandeller}
                              />
                              <div className="flex-center flex-column">
                                <Icon icon={plus} size={22} />
                              </div>
                            </div>
                          </div>

                          {/* image preview */}
                          {thumbnail.preview ? (
                            <div className="thumbnail-container text-center">
                              <div className="image border">
                                <img
                                  src={thumbnail.preview}
                                  className="img-fluid"
                                  alt="..."
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {/* inside image end */}
                  </div>

                  <div>
                    {/* Submit button */}
                    <div className="col-6 text-right">
                      <button
                        type="submit"
                        className="btn shadow-none"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating..." : "Create Product"}
                      </button>
                    </div>
                  </div>
                </form>
              </Card.Body>
            </Card.Simple>
          </Container.Column>
        </Container.Row>
      </Container.Fluid>
    </div>
  );
};

export default Create;

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: 42,
    fontSize: 14,
    color: "#000",
    boxShadow: "none",
    "&:hover": { borderColor: "1px solid #ced4da" },
    border: state.isFocused ? "1px solid #dfdfdf" : "1px solid #ced4da",
    borderRadius: 4,
  }),
};
