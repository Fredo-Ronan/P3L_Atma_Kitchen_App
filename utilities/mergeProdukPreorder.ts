import { PRODUK, PRODUK_FOR_CUSTOMER_UI } from "@/types";

// Function to merge duplicates based on NAMA_PRODUK
export const mergeDuplicates = (
  products: PRODUK[]
): PRODUK_FOR_CUSTOMER_UI[] => {
  const productMap: { [key: string]: PRODUK_FOR_CUSTOMER_UI } = {};

  products.forEach((product) => {
    if (!productMap[product.NAMA_PRODUK]) {
      // If the product does not exist in the map, add it
      productMap[product.NAMA_PRODUK] = {
        ...product,
        LOYANG: [product.LOYANG],
        HARGA_PRODUK: [product.HARGA_PRODUK],
      };
    } else {
      // If it exists, merge the LOYANG and HARGA_PRODUK attributes
      productMap[product.NAMA_PRODUK].LOYANG.push(product.LOYANG);
      productMap[product.NAMA_PRODUK].HARGA_PRODUK.push(product.HARGA_PRODUK);
    }
  });

  // Convert the map back to an array
  return Object.values(productMap);
};
