# Modern QR Code Generator Template

A sleek, customizable QR Code Generator website template built with HTML, CSS, and JavaScript. Fully responsive, supports dark mode, and ready for Arabic (RTL) users. Perfect for developers, designers, and digital marketplaces like Picalica.

قالب موقع إنشاء رموز QR احترافي وسهل التخصيص، مبني بـ HTML وCSS وJavaScript. يدعم الوضع الليلي واللغة العربية (RTL)، وجاهز للعرض والبيع على موقع Picalica.

## ✨ Features

-   **Responsive Design**: Adapts seamlessly to mobile, tablet, and desktop screens.
-   **Dark/Light Mode**: Automatic detection and manual toggle for user preference.
-   **RTL Support**: Full right-to-left language support for Arabic users.
-   **Customization Options**: Adjust foreground/background colors, size, padding, and corner style.
-   **Content Types**: Generate QR codes for URLs, Text, Email, Phone, and vCard.
-   **Live Preview**: Real-time QR code generation and preview.
-   **Logo Integration**: Upload and embed custom logos within the QR code.
-   **Download Options**: Export QR codes as PNG or SVG.
-   **Copy & Print**: Easily copy the QR image to clipboard or print it.
-   **Persistent Settings**: Saves customization settings locally using `localStorage`.
-   **UTM Tracking**: Option to automatically add UTM parameters to URL QR codes.
-   **Animated Preview**: Soft pulse animation for the QR code preview.

## 🚀 Technologies Used

-   **HTML5**: Structure of the web application.
-   **CSS3**: Styling with modern features, including CSS variables for easy theming.
-   **JavaScript (ES6+)**: Core logic and interactivity.

### Libraries & CDNs

-   **QRCode.js**: For generating QR codes.
    ```html
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
    ```
-   **Lucide Icons**: Clean and modern SVG icons.
    *(Icons are inlined directly in `index.html` for simplicity and performance, but can be loaded via CDN if preferred.)*

## ⚙️ How to Run Locally

1.  **Clone the repository** (or download the ZIP and extract):
    ```bash
    git clone <repository-url>
    cd qr-generator-template
    ```
2.  **Open `index.html`**: Simply open the `index.html` file in your web browser. No web server is required for basic functionality.

    *For features like logo upload (due to browser security restrictions for `file://` protocol), it's recommended to serve the files via a local web server (e.g., using `python -m http.server` or `npx serve`).*

## 📝 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

## 📦 Notes for Publishing on Picalica

This template is designed to be easily publishable on digital marketplaces like Picalica. Ensure you package the following files:

-   `index.html`
-   `style.css`
-   `app.js`
-   `README.md`
-   `LICENSE`
-   Any additional assets (e.g., a `screenshots` folder with preview images).

Remember to provide clear instructions and attractive screenshots to showcase the template's features and customizability. The `README.md` already includes a marketing description in both English and Arabic, ready for use. You may also include the 3 prebuilt demo QR samples as images or links.
