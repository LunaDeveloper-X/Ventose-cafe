export type MenuItem = {
  name: string;
  price?: number;
  prices?: { small?: number; medium?: number; large?: number; family?: number };
  image: string;
  description?: string;
};

export type MenuCategory = {
  id: string;
  label: string;
  title: string;
  items: MenuItem[];
  note?: string;
};

const foodImages = {
  pizza: 'https://images.pexels.com/photos/19786209/pexels-photo-19786209.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  pizzaAlt: 'https://images.pexels.com/photos/5903378/pexels-photo-5903378.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  steak: 'https://images.pexels.com/photos/765082/pexels-photo-765082.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  steakAlt: 'https://images.pexels.com/photos/39452690/pexels-photo-39452690.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  burger: 'https://images.pexels.com/photos/5374419/pexels-photo-5374419.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  wings: 'https://images.pexels.com/photos/14661492/pexels-photo-14661492.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  chicken: 'https://images.pexels.com/photos/5724555/pexels-photo-5724555.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  noodles: 'https://images.pexels.com/photos/40263070/pexels-photo-40263070.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  pasta: 'https://images.pexels.com/photos/17942486/pexels-photo-17942486.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  soup: 'https://images.pexels.com/photos/8743888/pexels-photo-8743888.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  drinks: 'https://images.pexels.com/photos/36880408/pexels-photo-36880408.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

export const cafeImages = [
  { src: '/images/WhatsApp_Image_2026-11-09_at_4.50.01_PM.jpeg', title: 'The dining room' },
  { src: '/images/WhatsApp_Image_2026-11-09_at_4.50.02_PM_(1).jpeg', title: 'A table at Ventose' },
  { src: '/images/WhatsApp_Image_2026-11-09_at_4.50.02_PM.jpeg', title: 'Light, shadow & gold' },
  { src: '/images/WhatsApp_Image_2026-11-09_at_4.50.03_PM.jpeg', title: 'The Ventose welcome' },
];

export const menuCategories: MenuCategory[] = [
  { id: 'starters', label: 'Starters', title: 'Starters', items: [
    { name: 'Sesame Chicken Strips', price: 630, image: foodImages.chicken }, { name: 'Mozzarella Sticks', price: 659, image: foodImages.pasta }, { name: 'Fajita Nachos', price: 420, image: foodImages.pizzaAlt }, { name: 'Ventose Special Nachos', price: 580, image: foodImages.chicken }, { name: 'English Fish & Chips', price: 690, image: foodImages.chicken },
  ] },
  { id: 'soups', label: 'Soups', title: 'Soups', items: [
    { name: 'Ventose Special Soup', price: 399, image: foodImages.soup }, { name: 'Cream of Mushroom Soup', price: 299, image: foodImages.soup }, { name: 'Hot & Sour Soup', price: 299, image: foodImages.soup }, { name: 'Cream of Chicken Soup', price: 349, image: foodImages.chicken }, { name: 'Chicken Corn Soup', price: 320, image: foodImages.soup },
  ] },
  { id: 'pastas-salads', label: 'Pastas & Salads', title: 'Pastas & Salads', items: [
    { name: 'Alfredo Pasta', price: 899, image: foodImages.pasta }, { name: 'Ventose Special Penne Baked', price: 999, image: foodImages.pasta }, { name: 'Pistachio Pesto Pasta', price: 1099, image: foodImages.pasta }, { name: 'Caesar Salad', price: 549, image: foodImages.pasta }, { name: 'Ventose Special Salad', price: 649, image: foodImages.pasta }, { name: 'Crispy Chicken Tostada', price: 399, image: foodImages.chicken },
  ] },
  { id: 'pizzas', label: 'Pizzas', title: 'Pizzas', note: 'Our dough is made fresh every day', items: [
    { name: 'Chicken Fajita Pizza', prices: { small: 720, medium: 1199, large: 1999, family: 2399 }, image: foodImages.pizza }, { name: 'Chicken Tikka Pizza', prices: { small: 750, medium: 1199, large: 1999, family: 2399 }, image: foodImages.pizzaAlt }, { name: 'Ventose Special Pizza', prices: { small: 900, medium: 1299, large: 2299, family: 2899 }, image: foodImages.pizza }, { name: 'Beef Pepperoni Pizza', prices: { small: 750, medium: 1299, large: 2499, family: 2899 }, image: foodImages.pizzaAlt }, { name: 'Cheese Lover Pizza', prices: { small: 600, medium: 900, large: 1299, family: 1999 }, image: foodImages.pizza }, { name: 'BBQ Chicken Pizza', prices: { small: 549, medium: 700, large: 1099, family: 1499 }, image: foodImages.pizzaAlt }, { name: 'Half Moon Pizza', prices: { small: 599, medium: 899, large: 1299, family: 1699 }, image: foodImages.pizza }, { name: 'Ventose Train Pizza', prices: { small: 3699 }, image: foodImages.pizza, description: '1 meter pizza with different flavours' },
  ] },
  { id: 'fast-food', label: 'Fast Food', title: 'Fast Food', items: [
    { name: 'Plain Fries', price: 230, image: foodImages.burger }, { name: 'Garlic Mayo Fries', price: 300, image: foodImages.burger }, { name: 'Chicken Loaded Fries', price: 530, image: foodImages.chicken }, { name: 'Beef Fajita Roll', price: 499, image: foodImages.chicken }, { name: 'Crispy Chicken Roll', price: 399, image: foodImages.chicken }, { name: 'Ventose Special Roll', price: 570, image: foodImages.chicken }, { name: 'Zinger Burger', price: 469, image: foodImages.burger }, { name: 'BBQ Chicken Burger', price: 730, image: foodImages.burger }, { name: 'Smashed Beef Burger (Double Patty)', price: 999, image: foodImages.burger }, { name: 'Ventose Texas Stuffed Chicken Burger', price: 699, image: foodImages.burger }, { name: 'BBQ Wings', price: 699, image: foodImages.wings }, { name: 'Buffalo Wings', price: 430, image: foodImages.wings }, { name: 'Honey Mustard Wings', price: 699, image: foodImages.wings }, { name: 'Crispy Wings', price: 530, image: foodImages.wings }, { name: 'Ventose Special Honey Glaze Wings', price: 699, image: foodImages.wings },
  ] },
  { id: 'chinese-thai', label: 'Chinese & Thai', title: 'Chinese & Thai', items: [
    { name: 'Chicken Manchurian', price: 850, image: foodImages.noodles }, { name: 'Hot Garlic Chicken', price: 780, image: foodImages.chicken }, { name: 'Chicken Chilli Dry', price: 1050, image: foodImages.noodles }, { name: 'Beef Chilli Dry', price: 1150, image: foodImages.steak }, { name: 'Beef Chilli Noodles', price: 899, image: foodImages.noodles }, { name: 'Spicy Korean Chicken', price: 899, image: foodImages.chicken }, { name: 'Chicken Shashlik', price: 899, image: foodImages.chicken }, { name: 'Sweet & Sour Chicken', price: 799, image: foodImages.chicken }, { name: 'Ventose Special Chicken', price: 1199, image: foodImages.chicken }, { name: 'Thai Hot Basil Chicken', price: 1099, image: foodImages.noodles }, { name: 'Chicken Chow Mein', price: 699, image: foodImages.noodles },
  ] },
  { id: 'mains', label: 'Mains', title: 'Mains', items: [
    { name: 'Chicken A La Kiev', price: 1330, image: foodImages.chicken }, { name: 'Chicken Roulade', price: 1399, image: foodImages.chicken }, { name: 'Tarragon Chicken', price: 1299, image: foodImages.chicken }, { name: 'Jalapeno Chicken', price: 1099, image: foodImages.chicken }, { name: 'Chicken Parmigiana', price: 1299, image: foodImages.chicken }, { name: 'Mushroom Chicken', price: 1050, image: foodImages.chicken }, { name: 'Tuscan Chicken', price: 1099, image: foodImages.chicken },
  ] },
  { id: 'steaks', label: 'Steaks', title: 'Steaks', items: [
    { name: 'Mexican Steak', price: 1899, image: foodImages.steak }, { name: 'Mushroom Steak', price: 1920, image: foodImages.steakAlt }, { name: 'Beef Medallion Steak', price: 2199, image: foodImages.steak }, { name: 'Black Pepper Steak', price: 1930, image: foodImages.steakAlt }, { name: 'Ventose Special Steak', price: 2099, image: foodImages.steak }, { name: 'BBQ Beef Steak', price: 1930, image: foodImages.steakAlt },
  ] },
  { id: 'drinks', label: 'Drinks', title: 'Drinks', items: [
    { name: 'Mint Margarita', price: 220, image: foodImages.drinks }, { name: 'Lemonade', price: 200, image: foodImages.drinks }, { name: 'Fresh Lime', price: 185, image: foodImages.drinks },
  ] },
];

export const coldDrinks = ['Mineral Water (Small / Large)', 'Pepsi / 7UP / Dew / Coke / Sprite', 'Diet Drinks', 'Sting'];
