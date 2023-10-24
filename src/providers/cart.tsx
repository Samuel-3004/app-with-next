"use client";
import { IProductWithTotalPrice } from "@/helpers/product";
import { ReactNode, createContext, useEffect, useMemo, useState } from "react";

export interface ICartProduct extends IProductWithTotalPrice {
  quantity: number;
}

interface ICartContext {
  products: ICartProduct[];
  cartTotalPrice: number;
  cartBasePrice: number;
  cartTotalDiscount: number;
  subtotal: number;
  total: number;
  totalDiscount: number;
  addProductToCart: (product: ICartProduct) => void;
  increaseProductQuantity: (productId: string) => void;
  decreaseProductQuantity: (productId: string) => void;
  deleteProductCart: (productId: string) => void;
}

export const CartContext = createContext<ICartContext>({
  products: [],
  cartTotalPrice: 0,
  cartBasePrice: 0,
  cartTotalDiscount: 0,
  subtotal: 0,
  total: 0,
  totalDiscount: 0,
  addProductToCart: () => {},
  increaseProductQuantity: () => {},
  decreaseProductQuantity: () => {},
  deleteProductCart: () => {},
});

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ICartProduct[]>(
    JSON.parse(localStorage.getItem("@tech-store/cart-products") || "[]"),
  );

  useEffect(() => {
    localStorage.setItem("@tech-store/cart-products", JSON.stringify(products));
  }, [products]);

  const subtotal = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + Number(product.basePrice) * Number(product.quantity);
    }, 0);
  }, [products]);

  const total = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + Number(product.totalPrice) * Number(product.quantity);
    }, 0);
  }, [products]);

  const totalDiscount = subtotal - total;

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

  const increaseProductQuantity = (productId: string) => {
    const increaseProduct = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          quantity: Number(product.quantity) + 1,
        };
      } else {
        return product;
      }
    });
    setProducts([...increaseProduct]);
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

  const deleteProductCart = (productId: string) => {
    const newListProducts = products.filter(
      (product) => product.id !== productId,
    );
    setProducts([...newListProducts]);
  };

  return (
    <CartContext.Provider
      value={{
        products,
        addProductToCart,
        decreaseProductQuantity,
        increaseProductQuantity,
        deleteProductCart,
        cartTotalPrice: 0,
        cartBasePrice: 0,
        cartTotalDiscount: 0,
        subtotal,
        total,
        totalDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
