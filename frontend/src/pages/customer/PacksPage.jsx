import React from "react";

const PacksPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      
      {/* Header */}
      <div style={{
        background: "#6bd36b",
        padding: "30px",
        borderRadius: "10px",
        textAlign: "center"
      }}>
        <h1>Subscription Packs</h1>
        <p>Save up to 25% with our curated grocery bundles.</p>
      </div>

      {/* Cards */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginTop: "20px"
      }}>
        
        {/* Card */}
        <div style={card}>
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e" style={img}/>
          <h3>Daily Essentials Pack</h3>
          <p>Monthly</p>
          <p>✔ Rice (5kg)</p>
          <p>✔ Dal (2kg)</p>
          <p>✔ Oil (2L)</p>
          <h4>₹799 <span style={strike}>₹1299</span></h4>
          <button style={btn}>Subscribe</button>
        </div>

        <div style={card}>
          <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd" style={img}/>
          <h3>Fresh Veggies Weekly</h3>
          <p>Weekly</p>
          <p>✔ Tomatoes</p>
          <p>✔ Onions</p>
          <p>✔ Potatoes</p>
          <h4>₹399 <span style={strike}>₹499</span></h4>
          <button style={btn}>Subscribe</button>
        </div>

        <div style={card}>
          <img src="https://images.unsplash.com/photo-1580910051074-3eb694886505" style={img}/>
          <h3>Dairy Delight</h3>
          <p>Monthly</p>
          <p>✔ Milk</p>
          <p>✔ Curd</p>
          <p>✔ Paneer</p>
          <h4>₹599 <span style={strike}>₹749</span></h4>
          <button style={btn}>Subscribe</button>
        </div>

      </div>
    </div>
  );
};

const card = {
  width: "300px",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  background: "#fff"
};

const img = {
  width: "100%",
  borderRadius: "10px"
};

const btn = {
  background: "green",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const strike = {
  textDecoration: "line-through",
  color: "gray",
  marginLeft: "10px"
};

export default PacksPage;