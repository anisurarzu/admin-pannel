import Icon from "react-icons-kit";
import {
  grid,
  creditCard,
  list,
  plus,
  gift,
  image,
  layers,
  eyeOff,
  rss,
  shoppingCart,
  users,
  userPlus,
  activity,
  umbrella,
  bookOpen,
  rotateCcw,
  barChart2,
  truck,
  shieldOff,
  navigation2,
} from "react-icons-kit/feather";
import { mapMarker, locationArrow } from "react-icons-kit/fa";

// Dashboard
import DashboardIndex from "../pages/dashboard/Index";

// Addsense
import AddsenseIndex from "../pages/addsense/Index";
import AddsenseCreate from "../pages/addsense/Create";
import AddsenseEdit from "../pages/addsense/Edit";

// Brand
import BrandIndex from "../pages/brand/Index";
import BrandCreate from "../pages/brand/Create";
import BrandEdit from "../pages/brand/Edit";

// Banner
import BannerIndex from "../pages/banner/Index";
import BannerCreate from "../pages/banner/Create";
import BannerEdit from "../pages/banner/Edit";

// Vendor
import VendorIndex from "../pages/vendor/Index";
import VendorCreate from "../pages/vendor/Create";
import VendorEdit from "../pages/vendor/Edit";
import VendorShow from "../pages/vendor/Show";

// Category
import CategoryIndex from "../pages/category/Index";
import CategoryCreate from "../pages/category/Create";
import CategoryEdit from "../pages/category/Edit";

// Product
import ProductIndex from "../pages/product/Index";
import PendingProducts from "../pages/product/Pending";
import ProductCreate from "../pages/product/Create";
import ProductEdit from "../pages/product/Edit";
import ProductEditSlug from "../pages/product/EditSlug";
import ProductShow from "../pages/product/Show";
// import ProductCreate2 from '../pages/product/Create2'

// Deactive
import DeactivatedIndex from "../pages/deactivated/Index";
import DeactivatedCreate from "../pages/deactivated/Create";

// Campaign
import CampaignIndex from "../pages/campaign/Index";
import CampaignCreate from "../pages/campaign/Create";
import CampaignShow from "../pages/campaign/Show";
import CampaignEdit from "../pages/campaign/Edit";

// Coupon
import CouponIndex from "../pages/coupon/Index";
import CouponCreate from "../pages/coupon/Create";
import CouponShow from "../pages/coupon/Show";
import CouponEdit from "../pages/coupon/Edit";

// Order
import OrdersIndex from "../pages/orders/Index";
import OrderShow from "../pages/orders/Show";
import OrderEdit from "../pages/orders/Edit";
import OrderCreate from "../pages/orders/Create";
import OrderPurchase from "../pages/orders/Purchase";
import OrderInvoice from "../pages/orders/Invoice";

// Shipping
import ShippingIndex from "../pages/shipping/Index";
import ShippingCreate from "../pages/shipping/Create";
import ShippingEdit from "../pages/shipping/Edit";
import ShippingShow from "../pages/shipping/Show";
import ShippingAreaIndex from "../pages/shipping/area/Index";
import ShippingAreaCreate from "../pages/shipping/area/Create";
import ShippingAreaEdit from "../pages/shipping/area/Edit";
import ShippingDistrictIndex from "../pages/shipping/district/Index";
import ShippingDistrictCreate from "../pages/shipping/district/Create";
import ShippingDistrictEdit from "../pages/shipping/district/Edit";
import ShippingDivisionIndex from "../pages/shipping/division/Index";
import ShippingDivisionCreate from "../pages/shipping/division/Create";
import ShippingDivisionEdit from "../pages/shipping/division/Edit";

// // District
// import DistrictIndex from '../pages/district'
// import DistrictCreate from '../pages/district/create'
// import DistrictEdit from '../pages/district/edit'
// import DistrictShow from '../pages/district/show'

// // Area
// import AreaIndex from '../pages/area'
// import AreaCreate from '../pages/area/create'
// import AreaEdit from '../pages/area/edit'

// Refund
import RefundIndex from "../pages/refund/Index";
import RefundShow from "../pages/refund/Show";

// Admin
import AdminList from "../pages/admin/Index";
import AdminEdit from "../pages/admin/Edit";
import AdminCreate from "../pages/admin/Create";

// Customer
import CustomerIndex from "../pages/customer/Index";
import CustomerEdit from "../pages/customer/Edit";
import CustomerCreate from "../pages/customer/Create";

// Subscribe
import SubscriberIndex from "../pages/subscriber/Index";

// Rating & Review
import RatingsReviewIndex from "../pages/ratingsReviews/Index";

// Reports
import BuyerRegistrationReportIndex from "../pages/reports/buyerRegistration/Index";
import SalesReportIndex from "../pages/reports/salesReport/Index";
import VendorPoIndex from "../pages/reports/vedorPo/Index";
import VendorPoShow from "../pages/reports/vedorPo/Show";
import BestSaleIndex from "../pages/reports/bestSales/Index";
import BuyerPurchaseIndex from "../pages/reports/buyerPurchase/Index";
import BestCategoryIndex from "../pages/reports/bestCategory/Index";
import StoreCreditIndex from "../pages/reports/storeCredit/Index";

// University
import UniversityCategoryIndex from "../pages/university/category/Index";
import UniversityCategoryCreate from "../pages/university/category/Create";
import UniversityCategoryEdit from "../pages/university/category/Edit";
import UniversityPostIndex from "../pages/university/post/Index";
import UniversityPostCreate from "../pages/university/post/Create";
import UniversityPostEdit from "../pages/university/post/Edit";
import UniversityPostShow from "../pages/university/post/Show";

// Role & Permission
import RoleIndex from "../pages/role/Index";
import RoleCreate from "../pages/role/Create";
import RoleEdit from "../pages/role/Edit";

// Profile
import ProfileIndex from "../pages/profile/Index";
import { userCheck } from "react-icons-kit/feather";
import { database } from "react-icons-kit/feather";
import { star } from "react-icons-kit/feather";
import { dollarSign } from "react-icons-kit/feather";
import { arrowUpRight } from "react-icons-kit/feather";
import { clock } from "react-icons-kit/feather";
import { cloudLightning } from "react-icons-kit/feather";
// import { mapPin } from 'react-icons-kit/feather'

export const routes = [
  {
    title: "Dashboard",
    name: "dashboard",
    /* path: "/dashboard/", */
    exact: true,
    inDrawer: true,
    icon: <Icon icon={grid} size={16} />,
    component: DashboardIndex,
  },
  /* {
        title: "Dashboard",
        name: "dashboard",
        path: "/dashboard/",
        exact: true,
        inDrawer: true,
        icon: <Icon icon={grid} size={16} />,
        component: DashboardIndex
    },
    {
        title: "Addsense",
        name: "addsense",
        inDrawer: true,
        icon: <Icon icon={creditCard} size={18} />,
        child: [
            {
                title: "All Addsense",
                name: "addsense index",
                path: "/dashboard/addsense",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={list} size={18} />,
                component: AddsenseIndex
            },
            {
                title: "New Addsense",
                name: "addsense store",
                path: "/dashboard/addsense/store",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={plus} size={18} />,
                component: AddsenseCreate
            },
            {
                title: "Edit Addsense",
                name: "addsense edit",
                path: "/dashboard/addsense/:id/edit",
                exact: true,
                inDrawer: false,
                icon: null,
                component: AddsenseEdit
            }
        ]
    },
    {
        title: "Banner",
        name: "banner",
        inDrawer: true,
        icon: <Icon icon={image} size={18} />,
        child: [
            {
                title: "All Banner",
                name: "banner index",
                path: "/dashboard/banner",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={list} size={18} />,
                component: BannerIndex
            },
            {
                title: "New Banner",
                name: "banner create",
                path: "/dashboard/banner/create",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={plus} size={18} />,
                component: BannerCreate
            },
            {
                title: "Edit Banner",
                name: "banner edit",
                path: "/dashboard/banner/:id/edit",
                exact: true,
                inDrawer: false,
                icon: null,
                component: BannerEdit
            }
        ]
    },
    {
        title: "Brand",
        name: "brand",
        inDrawer: true,
        icon: <Icon icon={gift} size={18} />,
        child: [
            {
                title: "All Brand",
                name: "brand index",
                path: "/dashboard/brand",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={list} size={18} />,
                component: BrandIndex
            },
            {
                title: "New Brand",
                name: "brand create",
                path: "/dashboard/brand/create",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={plus} size={18} />,
                component: BrandCreate
            },
            {
                title: "Edit Brand",
                name: "brand edit",
                path: "/dashboard/brand/:id/edit",
                exact: true,
                inDrawer: false,
                icon: null,
                component: BrandEdit
            }
        ]
    },
    {
        title: "Vendor",
        name: "vendor",
        inDrawer: true,
        icon: <Icon icon={userCheck} size={18} />,
        child: [
            {
                title: "All Vendor",
                name: "vendor index",
                path: "/dashboard/vendor",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={list} size={18} />,
                component: VendorIndex
            },
            {
                title: "New Vendor",
                name: "vendor create",
                path: "/dashboard/vendor/create",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={userPlus} size={18} />,
                component: VendorCreate
            },
            {
                title: "Edit Vendor",
                name: "vendor edit",
                path: "/dashboard/vendor/:id/edit",
                exact: true,
                inDrawer: false,
                icon: null,
                component: VendorEdit
            },
            {
                title: "Show Vendor",
                name: "vendor show",
                path: "/dashboard/vendor/:id/show",
                exact: true,
                inDrawer: false,
                icon: null,
                component: VendorShow
            }
        ]
    },
    {
        title: "Category",
        name: "category",
        inDrawer: true,
        icon: <Icon icon={layers} size={18} />,
        child: [
            {
                title: "All Category",
                name: "category index",
                path: "/dashboard/category",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={list} size={18} />,
                component: CategoryIndex
            },
            {
                title: "New Category",
                name: "category create",
                path: "/dashboard/category/create",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={plus} size={18} />,
                component: CategoryCreate
            },
            {
                title: "Edit Category",
                name: "category edit",
                path: "/dashboard/category/:type/:id/edit",
                exact: true,
                inDrawer: false,
                icon: null,
                component: CategoryEdit
            }
        ]
    }, */
   
  {
    title: "Product",
    name: "product",
    inDrawer: true,
    icon: <Icon icon={database} size={18} />,
    child: [
      {
        title: "All Product",
        name: "product index",
        path: "/dashboard/product",
        exact: true,
        inDrawer: true,
        icon: <Icon icon={list} size={18} />,
        component: ProductIndex,
      },
      /* {
        title: "Pending Product",
        name: "product pending",
        path: "/dashboard/product/pending/items",
        exact: true,
        inDrawer: true,
        icon: <Icon icon={eyeOff} size={18} />,
        component: PendingProducts,
      }, */
      {
        title: "New Product",
        name: "product create",
        path: "/dashboard/product/create",
        exact: true,
        inDrawer: true,
        icon: <Icon icon={plus} size={18} />,
        component: ProductCreate,
      },
      // {
      //     title: "New Product V2",
      //     name: "product create v2",
      //     path: "/dashboard/product/create/v2",
      //     exact: true,
      //     inDrawer: true,
      //     icon: <Icon icon={plus} size={18} />,
      //     component: ProductCreate2
      // },
      {
        title: "Edit Product",
        name: "product edit",
        path: "/dashboard/product/:id/edit",
        exact: true,
        inDrawer: false,
        icon: null,
        component: ProductEdit,
      },
      /* {
        title: "Edit Product Slug",
        name: "product slug edit",
        path: "/dashboard/product/:id/edit/slug",
        exact: true,
        inDrawer: false,
        icon: null,
        component: ProductEditSlug,
      }, */
      {
        title: "Show Product",
        name: "product show",
        path: "/dashboard/product/:id/show",
        exact: true,
        inDrawer: false,
        icon: null,
        component: ProductShow,
      },
    ],
  },
  /*  {
        title: "Deactivated",
        name: "deactivated",
        inDrawer: true,
        icon: <Icon icon={eyeOff} size={18} />,
        child: [
            {
                title: "All items",
                name: "deactivated index",
                path: "/dashboard/deactivated",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={list} size={18} />,
                component: DeactivatedIndex
            },
            {
                title: "New Item",
                name: "deactivated create",
                path: "/dashboard/deactivated/create",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={plus} size={18} />,
                component: DeactivatedCreate
            }
        ]
    },
    {
        title: "Campaign",
        name: "campaign",
        inDrawer: true,
        icon: <Icon icon={umbrella} size={18} />,
        child: [
            {
                title: "All Campaign",
                name: "campaign index",
                path: "/dashboard/campaign",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={list} size={18} />,
                component: CampaignIndex
            },
            {
                title: "New Campaign",
                name: "campaign create",
                path: "/dashboard/campaign/create",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={plus} size={18} />,
                component: CampaignCreate
            },
            {
                title: "Show Campaign",
                name: "campaign show",
                path: "/dashboard/campaign/:id/show",
                exact: true,
                inDrawer: false,
                icon: null,
                component: CampaignShow
            },
            {
                title: "Edit Campaign",
                name: "campaign edit",
                path: "/dashboard/campaign/:id/edit",
                exact: true,
                inDrawer: false,
                icon: null,
                component: CampaignEdit
            }
        ]
    },
    {
        title: "Coupon",
        name: "coupon",
        inDrawer: true,
        icon: <Icon icon={rss} size={18} />,
        child: [
            {
                title: "All Coupon",
                name: "coupon index",
                path: "/dashboard/coupon",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={list} size={18} />,
                component: CouponIndex
            },
            {
                title: "New Coupon",
                name: "coupon create",
                path: "/dashboard/coupon/create",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={plus} size={18} />,
                component: CouponCreate
            },
            {
                title: "Show Coupon",
                name: "coupon show",
                path: "/dashboard/coupon/:id/show",
                exact: true,
                inDrawer: false,
                icon: null,
                component: CouponShow
            },
            {
                title: "Edit Coupon",
                name: "coupon edit",
                path: "/dashboard/coupon/:id/edit",
                exact: true,
                inDrawer: false,
                icon: null,
                component: CouponEdit
            }
        ]
    },
    {
        title: "Order",
        name: "order",
        inDrawer: true,
        icon: <Icon icon={shoppingCart} size={18} />,
        child: [
            {
                title: "All Order",
                name: "order index",
                path: "/dashboard/order",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={list} size={18} />,
                component: OrdersIndex
            },
            {
                title: "New Order",
                name: "order store",
                path: "/dashboard/order/create",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={plus} size={18} />,
                component: OrderCreate
            },
            {
                title: "Show Order",
                name: "order show",
                path: "/dashboard/order/:id/show",
                exact: true,
                inDrawer: false,
                icon: null,
                component: OrderShow
            },
            {
                title: "Edit Order",
                name: "order show",
                path: "/dashboard/order/:id/edit",
                exact: true,
                inDrawer: false,
                icon: null,
                component: OrderEdit
            },
            {
                title: "Show PO",
                name: "order po",
                path: "/dashboard/order/:id/purchase/:product_id",
                exact: true,
                inDrawer: false,
                icon: null,
                component: OrderPurchase
            },
            {
                title: "Order Invoice",
                name: "order invoice",
                path: "/dashboard/order/:id/invoice",
                exact: true,
                inDrawer: false,
                icon: null,
                component: OrderInvoice
            }
        ]
    },
    {
        title: "Shipping",
        name: "shipping",
        inDrawer: true,
        icon: <Icon icon={truck} size={18} />,
        child: [
            {
                title: "All Shipping",
                name: "shipping index",
                path: "/dashboard/shipping",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={list} size={18} />,
                component: ShippingIndex
            },
            {
                title: "New Shipping",
                name: "shipping create",
                path: "/dashboard/shipping/create",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={plus} size={18} />,
                component: ShippingCreate
            },
            {
                title: "Show Shipping",
                name: "shipping show",
                path: "/dashboard/shipping/:id/show",
                exact: true,
                inDrawer: false,
                icon: null,
                component: ShippingShow
            },
            {
                title: "Edit Shipping",
                name: "shipping edit",
                path: "/dashboard/shipping/:id/edit",
                exact: true,
                inDrawer: false,
                icon: null,
                component: ShippingEdit
            },

            {
                title: "Area",
                name: "shipping-area",
                inDrawer: true,
                icon: <Icon icon={mapMarker} size={18} />,
                child: [

                    {
                        title: "All Area",
                        name: "shipping area index",
                        inDrawer: true,
                        exact: true,
                        icon: <Icon icon={list} size={18} />,
                        path: "/dashboard/shipping/area",
                        component: ShippingAreaIndex
                    },
                    {
                        title: "New Area",
                        name: "shipping area create",
                        inDrawer: true,
                        exact: true,
                        icon: <Icon icon={plus} size={18} />,
                        path: "/dashboard/shipping/area/create",
                        component: ShippingAreaCreate
                    },
                    {
                        title: "Edit Area",
                        name: "shipping area edit",
                        inDrawer: false,
                        exact: true,
                        icon: null,
                        path: "/dashboard/shipping/area/:id/edit",
                        component: ShippingAreaEdit

                    },
                ]
            },

            {
                title: "District",
                name: "shipping-district",
                inDrawer: true,
                icon: <Icon icon={locationArrow} size={18} />,
                child: [
                    {
                        title: "All District",
                        name: "shipping district index",
                        inDrawer: true,
                        exact: true,
                        icon: <Icon icon={list} size={18} />,
                        path: "/dashboard/shipping/district",
                        component: ShippingDistrictIndex
                    },
                    {
                        title: "New District",
                        name: "shipping district create",
                        inDrawer: true,
                        exact: true,
                        icon: <Icon icon={plus} size={18} />,
                        path: "/dashboard/shipping/district/create",
                        component: ShippingDistrictCreate
                    },
                    {
                        title: "Edit District",
                        name: "shipping district edit",
                        inDrawer: false,
                        exact: true,
                        icon: null,
                        path: "/dashboard/shipping/district/:id/edit",
                        component: ShippingDistrictEdit
                    }
                ]
            },

            {
                title: "Division",
                name: "shipping-division",
                inDrawer: true,
                icon: <Icon icon={navigation2} size={18} />,
                child: [
                    {
                        title: "All Division",
                        name: "shipping division index",
                        inDrawer: true,
                        exact: true,
                        icon: <Icon icon={list} size={18} />,
                        path: "/dashboard/shipping/division",
                        component: ShippingDivisionIndex
                    },
                    {
                        title: "New Division",
                        name: "shipping division create",
                        inDrawer: true,
                        exact: true,
                        icon: <Icon icon={plus} size={18} />,
                        path: "/dashboard/shipping/division/create",
                        component: ShippingDivisionCreate
                    },
                    {
                        title: "Edit Division",
                        name: "shipping division edit",
                        inDrawer: false,
                        exact: true,
                        icon: null,
                        path: "/dashboard/shipping/division/:id/edit",
                        component: ShippingDivisionEdit
                    }
                ]
            }
        ]
    }, */
  // {
  //     title: "Shipping Area",
  //     name: "shipping-area",
  //     inDrawer: true,
  //     icon: <Icon icon={mapPin} size={18} />,
  //     child: [
  //         {
  //             title: "District",
  //             name: "district index",
  //             path: "/dashboard/district",
  //             exact: true,
  //             inDrawer: true,
  //             icon: <Icon icon={list} size={18} />,
  //             component: DistrictIndex
  //         },
  //         {
  //             title: "New district",
  //             name: "district create",
  //             path: "/dashboard/district/create",
  //             exact: true,
  //             inDrawer: true,
  //             icon: <Icon icon={plus} size={18} />,
  //             component: DistrictCreate
  //         },
  //         {
  //             title: "Show district",
  //             name: "district show",
  //             path: "/dashboard/district/:id/show",
  //             exact: true,
  //             inDrawer: false,
  //             icon: null,
  //             component: DistrictShow
  //         },
  //         {
  //             title: "Edit district",
  //             name: "district edit",
  //             path: "/dashboard/district/:id/edit",
  //             exact: true,
  //             inDrawer: false,
  //             icon: null,
  //             component: DistrictEdit
  //         },

  //         // Area
  //         {
  //             title: "Area",
  //             name: "area index",
  //             path: "/dashboard/area",
  //             exact: true,
  //             inDrawer: true,
  //             icon: <Icon icon={list} size={18} />,
  //             component: AreaIndex
  //         },
  //         {
  //             title: "New area",
  //             name: "area create",
  //             path: "/dashboard/area/create",
  //             exact: true,
  //             inDrawer: true,
  //             icon: <Icon icon={plus} size={18} />,
  //             component: AreaCreate
  //         },
  //         {
  //             title: "Edit area",
  //             name: "area edit",
  //             path: "/dashboard/area/:id/edit",
  //             exact: true,
  //             inDrawer: false,
  //             icon: null,
  //             component: AreaEdit
  //         }
  //     ]
  // },
  /*  {
        title: "Refund",
        name: "refund",
        path: "/dashboard/refund",
        exact: true,
        inDrawer: true,
        icon: <Icon icon={rotateCcw} size={18} />,
        component: RefundIndex
    },
    {
        title: "Refund Show",
        name: "refund show",
        path: "/dashboard/refund/:id/show",
        exact: true,
        inDrawer: false,
        icon: null,
        component: RefundShow
    },
    {
        title: "Admin",
        name: "admin",
        inDrawer: true,
        icon: <Icon icon={users} size={18} />,
        child: [
            {
                title: "All Admin",
                name: "admin index",
                path: "/dashboard/admin",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={list} size={18} />,
                component: AdminList
            },
            {
                title: "New Admin",
                name: "admin create",
                path: "/dashboard/admin/create",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={plus} size={18} />,
                component: AdminCreate
            },
            {
                title: "Edit Admin",
                name: "admin edit",
                path: "/dashboard/admin/:id/edit",
                exact: true,
                inDrawer: false,
                icon: null,
                component: AdminEdit
            }
        ]
    },
    {
        title: "Customer",
        name: "customer",
        inDrawer: true,
        icon: <Icon icon={users} size={18} />,
        child: [
            {
                title: "All Customer",
                name: "customer index",
                path: "/dashboard/customer",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={list} size={18} />,
                component: CustomerIndex
            },
            {
                title: "New Customer",
                name: "customer create",
                path: "/dashboard/customer/create",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={userPlus} size={18} />,
                component: CustomerCreate
            },
            {
                title: "Edit Customer",
                name: "customer edit",
                path: "/dashboard/customer/:id/edit",
                exact: true,
                inDrawer: false,
                icon: null,
                component: CustomerEdit
            }
        ]
    },
    {
        title: "Ratings & Reviews",
        name: "rating-review",
        path: "/dashboard/rating-review",
        exact: true,
        inDrawer: true,
        icon: <Icon icon={star} size={18} />,
        component: RatingsReviewIndex
    },
    {
        title: "Subscribers",
        name: "subscriber",
        path: "/dashboard/subscriber",
        exact: true,
        inDrawer: true,
        icon: <Icon icon={users} size={18} />,
        component: SubscriberIndex
    },
    {
        title: "Profile",
        name: "profile",
        path: "/dashboard/profile",
        exact: true,
        inDrawer: false,
        icon: null,
        component: ProfileIndex
    },
    {
        title: "Reports",
        name: "report",
        inDrawer: true,
        icon: <Icon icon={barChart2} size={18} />,
        child: [
            {
                title: "Buyer Registration",
                name: "buyer-registration",
                path: "/dashboard/report/buyer-registration",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={users} size={18} />,
                component: BuyerRegistrationReportIndex
            },
            {
                title: "Sales Report",
                name: "sales-report",
                path: "/dashboard/report/sales-report",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={dollarSign} size={18} />,
                component: SalesReportIndex
            },
            {
                title: "PO for Vendor",
                name: "vendor-po",
                path: "/dashboard/report/vendor-po",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={arrowUpRight} size={18} />,
                component: VendorPoIndex
            },
            {
                title: "Show PO for Vendor",
                name: "vendor-po-show",
                path: "/dashboard/report/vendor-po/show",
                exact: true,
                inDrawer: false,
                icon: null,
                component: VendorPoShow
            },
            {
                title: "Best Selling Products",
                name: "bestsale",
                path: "/dashboard/report/bestsale",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={activity} size={18} />,
                component: BestSaleIndex
            },
            {
                title: "Customer Purchase History",
                name: "buyer-purchase",
                path: "/dashboard/report/buyer-purchase",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={clock} size={18} />,
                component: BuyerPurchaseIndex
            },
            {
                title: "Best Performing Category",
                name: "bestsale",
                path: "/dashboard/report/performed-category",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={activity} size={18} />,
                component: BestCategoryIndex
            },
            {
                title: "Store Credit Report",
                name: "store-credit",
                path: "/dashboard/report/store-credit",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={cloudLightning} size={18} />,
                component: StoreCreditIndex
            }
        ]
    },
    {
        title: "EazyBest University",
        name: "university",
        inDrawer: true,
        icon: <Icon icon={bookOpen} size={18} />,
        child: [
            {
                title: "Category",
                name: "category index",
                path: "/dashboard/university/category",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={list} size={18} />,
                component: UniversityCategoryIndex
            },
            {
                title: "New Category",
                name: "category create",
                path: "/dashboard/university/category/create",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={plus} size={18} />,
                component: UniversityCategoryCreate
            },
            {
                title: "Category Edit",
                name: "category edit",
                path: "/dashboard/university/category/:id/edit",
                exact: true,
                inDrawer: false,
                icon: null,
                component: UniversityCategoryEdit
            },
            {
                title: "All Post",
                name: "post index",
                path: "/dashboard/university/post",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={list} size={18} />,
                component: UniversityPostIndex
            },
            {
                title: "New Post",
                name: "post create",
                path: "/dashboard/university/post/create",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={plus} size={18} />,
                component: UniversityPostCreate
            },
            {
                title: "Edit Post",
                name: "post edit",
                path: "/dashboard/university/post/:id/edit",
                exact: true,
                inDrawer: false,
                icon: null,
                component: UniversityPostEdit
            },
            {
                title: "Show Post",
                name: "post show",
                path: "/dashboard/university/post/:id/show",
                exact: true,
                inDrawer: false,
                icon: null,
                component: UniversityPostShow
            }
        ]
    },
    {
        title: "Role & Permission",
        name: "role",
        inDrawer: true,
        icon: <Icon icon={shieldOff} size={18} />,
        child: [
            {
                title: "All Roles",
                name: "role index",
                path: "/dashboard/role",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={list} size={18} />,
                component: RoleIndex
            },
            {
                title: "New Role",
                name: "role create",
                path: "/dashboard/role/create",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={plus} size={18} />,
                component: RoleCreate
            },
            {
                title: "Edit Role",
                name: "role edit",
                path: "/dashboard/role/:id/edit",
                exact: true,
                inDrawer: false,
                icon: null,
                component: RoleEdit
            }
        ]
    } */
];
