import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "../../auth/context";
import cartApi from "../../api/cart";
import { useFocusEffect } from "@react-navigation/native";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [allItemsChecked, setAllItemsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      if (user) {
        const response = await cartApi.getUserCartItems(user._id);
        if (Array.isArray(response.data)) {
          setCart(response.data);
        } else {
          console.error("Invalid response data");
        }
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart items: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      fetchCartItems(); // Refresh cart data whenever the screen gains focus
    }, [])
  );

  useEffect(() => {
    if (!user) {
      setCart([]);
    }
  }, [user]);

  /*
  const addToCart = (cartItem) => {
    const updatedCartItem = {
      ...cartItem,
      qty: 1,
      checked: true,
      salePrice: cartItem.product.discount_price
        ? cartItem.product.discount_price
        : cartItem.product.price,
    };
    const updatedCart = [...cart, updatedCartItem];
    setCart(updatedCart);
  };
*/

  const addToCart = async (cartItem) => {
    try {
      if (user) {
        const response = await cartApi.addToCart(cartItem);
        if (response.data) {
          await fetchCartItems(); // Refresh cart data after adding item
        } else {
          console.error("Error: Response data is null or undefined");
        }
      } else {
        // If user is not logged in, just add the item to the cart locally
        const updatedCartItem = {
          ...cartItem,
          qty: 1,
          checked: true,
        };
        const updatedCart = [...cart, updatedCartItem];
        setCart(updatedCart); // Using callback form of setCart
        console.log(cart); // Logging inside the callback to see updated state
      }
    } catch (error) {
      console.error("Error adding item to cart: ", error);
    }
  };

  const addToCartWithAmount = (amount) => {
    // Add wallet top-up to the cart
    const cartItem = {
      product: {
        name: "Wallet Top-Up",
        images: [
          "https://th.bing.com/th/id/R.b05f3d77dfeb33dccf4ddd130f82f239?rik=djTPPXe8ri8zgQ&pid=ImgRaw&r=0",
        ],
        description: "Add money to your wallet",
      },
      amount: parseFloat(amount), // Convert amount to float
    };
    addToCart(cartItem);
  };

  const selectHandler = (index, checked) => {
    // Update the 'checked' property of the item at the specified index
    const updatedCart = [...cart];
    updatedCart[index].checked = !checked;
    setCart(updatedCart);
  };

  const selectHandlerAll = () => {
    // Select/deselect all items based on the provided flag

    const updatedCart = cart.map((item) => ({
      ...item,
      checked: !allItemsChecked,
    }));
    setCart(updatedCart);
    setAllItemsChecked(!allItemsChecked);
  };

  const deleteHandler = async (index) => {
    try {
      const updatedCart = [...cart];
      const deletedItem = updatedCart.splice(index, 1)[0]; // Remove item from the cart and get the deleted item
      setCart(updatedCart);

      if (user) {
        // If user is logged in, delete the item from the database as well
        await cartApi.deleteCartItem(deletedItem._id);
      }
    } catch (error) {
      console.error("Error deleting item from cart: ", error);
    }
  };

  const quantityHandler = (action, index) => {
    // Handle quantity changes (increase or decrease) based on the provided action
    const updatedCart = [...cart];
    const currentQty = updatedCart[index].qty;

    if (action === "less" && currentQty > 1) {
      updatedCart[index].qty -= 1;
    } else if (action === "more") {
      updatedCart[index].qty += 1;
    }

    setCart(updatedCart);
  };

  const subtotalPrice = () => {
    // Calculate the subtotal price of the checked items in the cart
    return cart.reduce((total, item) => {
      // Only include the item in the subtotal calculation if it is checked
      if (item.checked) {
        return item.salePrice
          ? total + item.qty * item.salePrice
          : total + item.qty * item.amount;
      }
      return total;
    }, 0);
  };

  const values = {
    cart,
    allItemsChecked,
    selectHandler,
    selectHandlerAll,
    deleteHandler,
    quantityHandler,
    subtotalPrice,
    addToCart,
    setCart,
    addToCartWithAmount,
    loading,
  };

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCart };
