"use client";
import { IProductWithTotalPrice } from "@/helpers/product";
import { ReactNode, createContext, useState } from "react";

export interface ICartProduct extends IProductWithTotalPrice {
  quantity: number;
}

interface ICartContext {
  products: ICartProduct[];
  cartTotalPrice: number;
  cartBasePrice: number;
  cartTotalDiscount: number;
  addProductToCart: (product: ICartProduct) => void;
  decreaseProductQuantity: (productId: string) => void;
}

export const CartContext = createContext<ICartContext>({
  products: [],
  cartTotalPrice: 0,
  cartBasePrice: 0,
  cartTotalDiscount: 0,
  addProductToCart: () => {},
  decreaseProductQuantity: () => {},
});

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ICartProduct[]>([]);

  const addProductToCart = (product: ICartProduct) => {
    const productIsAlreadyOnCart = products.some(
      (cartProduct) => cartProduct.id === product.id,
    );

    if (productIsAlreadyOnCart) {
      const newList = products.map((productList) => {
        if (productList.id === product.id) {
          return {
            ...product,
            quantity: Number(productList.quantity) + Number(product.quantity),
          };
        } else {
          return productList;
        }
      });
      setProducts([...newList]);
    } else {
      setProducts([...products, product]);
    }
  };

  const decreaseProductQuantity = (productId: string) => {
    const decreaseProduct = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          quantity: Number(product.quantity) - 1,
        };
      } else {
        return product;
      }
    });

    const newListProducts = decreaseProduct.filter(
      (product) => product.quantity !== 0,
    );
    setProducts([...newListProducts]);
  };

  return (
    <CartContext.Provider
      value={{
        products,
        addProductToCart,
        decreaseProductQuantity,
        cartTotalPrice: 0,
        cartBasePrice: 0,
        cartTotalDiscount: 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
