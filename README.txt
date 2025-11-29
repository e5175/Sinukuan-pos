Sinukuan POS System
Sinukuan POS is a simple, local Point-of-Sale (POS) application designed for a restaurant
specializing in Kapampangan cuisine. It provides a straightforward interface for managing the menu,
processing customer orders, calculating totals, and tracking a history of transactions.


Features
•	Product Management: Hardcoded menu items with ID, name, price, category, and image URL (managed in app.py).
•	Real-time Cart: Users can add and modify quantities of items in the cart instantly.
•	Client-side Calculation Display: Shows the subtotal and applies the SC/PWD (Senior Citizen/Person with Disability) discount (20%) dynamically on the frontend.
•	Server-side Verification: The final checkout calculation is verified by the Flask backend (/calculate API) using server-stored prices, preventing client-side price manipulation.
•	Order Tracking: Displays a summary of completed orders.
•	Category Filtering: Easily filter menu items by category (Starters, Main, Dessert, Drinks).


Technology Stack
•	Runtime: Python 3 & Flask
•	Language: Python, JavaScript
•	Frontend: HTML5 (Jinja2)
•	Styling: Tailwind CSS
•	Client Logic: JavaScript (ES6)
•	Data Storage: Local Python List
•	Order History: Local JavaScript Array


Installations
1. Clone the repository:
    git clone https://github.com/e5175/Sinukuan-pos.git
2. Navigate to the Project Directory:
    cd Sinukuan-pos
3. Create and Activate a Virtual Environment (Recommended):
    python3 -m venv venv
    source venv/bin/activate  # On Windows, use: venv\Scripts\activate
4. Install Dependencies
    pip install Flask

Evironment Setup
This project uses hardcoded data and does not require complex API keys.
1. Configure App Data: Ensure all product menu data is correctly defined in the PRODUCTS list within app.py.
2. Verify Static Assets: Confirm that the static/img/ folder contains all images referenced in the PRODUCTS list.


Quick Start
Development
To run the Flask application in development mode (which enables automatic reloading when code changes):
    export FLASK_APP=app.py
    flask run

Access
Visit the running application in your web browser:
    [http://127.0.0.1:5000](http://127.0.0.1:5000)



Repository Structure
/Sinukuan
├── app.py                      # Flask Application Entry, Menu Data (PRODUCTS), and API routes.
├── static/
│   ├── img/                    # Product images (e.g., Sisig.png).
│   └── script.js               # Main frontend logic (cart, clock, view switching).
└── templates/
    └── index.html              # Main UI template (Jinja2 for menu rendering, Tailwind CSS).


Example API Endpoints
/calculate	POST	Receives the cart object from the client and verifies the subtotal based on trusted server prices.


Example Request (from script.js):
    POST /calculate
    {
      "DRN001": 2,
      "M001": 1
    }


Example Response:
{
  "success": true,
  "subtotal": "560.00",
  "grand_total": "560.00"
}


Testing
Testing is primarily manual verification of functionality:
1. Verify that adding, removing, and quantity updates correctly reflect in the Cart totals.
2. Test the SC/PWD checkbox to confirm the 20% discount is applied and removed correctly.
3. Ensure the handleCheckout() function successfully sends data to the Flask endpoint and clears the cart on success.