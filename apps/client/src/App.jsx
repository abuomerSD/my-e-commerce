import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div>App</div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
