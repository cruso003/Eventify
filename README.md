# Eventify

Eventify is a mobile application designed to streamline the process of discovering and booking events. Whether you're looking for concerts, workshops, or conferences, Eventify provides a platform to explore a wide range of events and make bookings conveniently from your mobile device.

## Features

- Browse and search for events.
- See and Book future events on a schedule calendar
- View event details, including descriptions, date/time, venue, and ticket prices.
- Securely book tickets for events with integrated payment processing(Mobile Money, Stripe).
- Receive push notifications and email confirmations for booked events.
- User authentication and profile management.

## Technologies Used

- Frontend: React Native, Async Storage, Axios
- Backend: Node.js, Express.js, MongoDB
- Authentication: JWT (JSON Web Tokens)
- Push Notifications: Firebase Cloud Messaging (FCM) - In the works.
- Payment Processing: MTN MOMO API and Stripe API

## Installation

1. Clone the repository: `git clone https://github.com/cruso003/Eventify.git`
2. Navigate to the project directory: `cd Eventify`
3. Install dependencies:
   - Frontend: `cd eventify && npm install`
   - Backend: `cd backend && npm install`
4. Start the frontend and backend servers:
   - Frontend: `npx expo start`
   - Backend: `npm start`

## Contributing

Contributions are welcome! Please follow these guidelines:

- Fork the repository
- Create a new branch: `git checkout -b feature/your-feature`
- Commit your changes: `git commit -am 'Add new feature'`
- Push to the branch: `git push origin feature/your-feature`
- Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
