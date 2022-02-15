// Date formate
export const dateFormate = (date) => {
    date = new Date(date)
    const cdate = date.toDateString();
    return cdate;
}

export const formatDateWithAMPM = date => {
    date = new Date(date)
    const cdate = date.toDateString();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = cdate + ' ' + hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

// String Short
export const StringShort = data => {
    let string = data
    const firstLetter = string.slice(0, 1)
    return firstLetter
}

// Shopping-cart Price Calculator
export const priceCalculator = (products) => {
    let total = 0
    let campaignSubTotal = 0
    let regularSubTotal = 0

    if (products && products.length) {
        let discountType
        let discountAmount
        let discountStartFrom
        let discountEndTo

        for (let i = 0; i < products.length; i++) {
            const element = products[i]
            if (element.shopType && element.shopType === 'campaign') {
                campaignSubTotal += element.price * element.quantity
                discountType = element.discountType
                discountAmount = element.discountAmount
                discountStartFrom = element.startFrom
                discountEndTo = element.endTo
            } else {
                regularSubTotal += element.price * element.quantity
            }
        }

        if (discountType && discountType === 'Flat') {
            if (campaignSubTotal >= discountStartFrom && campaignSubTotal <= discountEndTo) {
                campaignSubTotal = campaignSubTotal - discountAmount
            }
        }

        if (discountType && discountType === 'Percentage') {
            if (campaignSubTotal >= discountStartFrom && campaignSubTotal <= discountEndTo) {
                campaignSubTotal = parseInt((campaignSubTotal * discountAmount) / 100)
            }
        }

        total = campaignSubTotal + regularSubTotal
        return total
    }
}

// Calculated Price
const CalculatedPrice = (discountType, discountAmount, salePrice, material) => {
    let total = 0

    if (material) {
        total = salePrice + material.adjustmentSellingPrice
    } else {
        total = salePrice
    }

    if (discountType && discountAmount) {
        if (discountType === 'Flat') {
            total = total - discountAmount
        } else {
            const percentTk = parseInt((discountAmount / 100) * total)
            total = parseInt(total) - percentTk
        }
    }

    return total
}

// Get initial material
export const InitialMaterial = data => {
    let newItem = null

    if (data && data.length && data[0].title) {
        const element = data[0].properties
        if (element && element.length) {
            const item = element[0]
            newItem = {
                item: data[0].title,
                sku: item.sku,
                adjustmentSellingPrice: item.adjustmentSellingPrice,
                adjustmentPurchasePrice: item.adjustmentPurchasePrice,
                value: item.values[0]
            }
        }
    }
    return newItem
}

// Prepare to cart 
export const PrepareCart = (data, material) => {
    const product = {
        _id: data._id,
        name: data.name,
        sku: data.sku,
        slug: data.slug,
        quantity: 1,
        brand: data.brand,
        vendor: data.vendor,
        mainCategory: data.mainCategory,
        subCategory: data.subCategory ? data.subCategory : null,
        leafCategory: data.leafCategory ? data.leafCategory : null,
        purchasePrice: data.purchasePrice,
        salePrice: data.salePrice,
        discountType: data.discountType ? data.discountType : null,
        discountAmount: data.discountAmount ? data.discountAmount : null,
        thumbnail: data.thumbnail.small,
        stockAmount: data.stockAmount,
        price: CalculatedPrice(data.discountType, data.discountAmount, data.salePrice, material),
        materials: material ? material : null
    }

    return product
}

// Make option
export const MakeOption = data => {
    let options = []
    if (data && data.length) {
        for (let i = 0; i < data.length; i++) {
            const element = data[i]
            options.push({
                value: element._id,
                label: element.name
            })
        }
    }
    return options
}

// Extract option
export const ExtractOption = data => {
    let options = []
    if (data && data.length) {
        for (let i = 0; i < data.length; i++) {
            const element = data[i]
            options.push(element.value)
        }
    }
    return options
}