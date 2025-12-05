import { Button, Card } from '@/components/ui';
import React from 'react';
import { Link } from 'react-router-dom'; // For navigation (if used in the template)

const InventoryView = () => {
   const images = [
    {
      src: 'https://opensooq-images.os-cdn.com/previews/0x720/32/1f/321f03d25dcf92fcaa16b09e23f30640397fa629bc2ed0f329e5ade34840218b.jpg.webp',
      alt: 'Car Main',
    },
    {
      src: 'https://opensooq-images.os-cdn.com/previews/0x720/e3/16/e316042d91cd114bf2db44d9294894ed59cb115cccc368df4fca26871c4c9b1a.jpg.webp',
      alt: 'Car Side',
    },
    {
      src: 'https://opensooq-images.os-cdn.com/previews/0x720/f6/5a/f65a9958bfd31e4e895f0e1c615cefd18f118facfb9a2ae09a2ff7cc5c93a055.jpg.webp',
      alt: 'Car Interior',
    },
    {
      src: 'https://opensooq-images.os-cdn.com/previews/0x720/da/d3/dad30807b5499e1e2a8ffb4071c8739f93101c62095c5010a7f66047fe1fcf85.jpg.webp',
      alt: 'Car Engine',
    },
    {
      src: 'https://opensooq-images.os-cdn.com/previews/0x720/b5/5f/b55f7b6dc258397e878f9dd76c952b5264b58cdf422a3cea23212eaaa80cc915.jpg.webp',
      alt: 'Car Front',
    },
    // ملاحظة: إزالة الصورة المكررة (Car Front)
  ];
    return (
    <div className="content-wrapper">
      {/* Header - Assuming ECME template has a header */}
      <div className="page-header">
        <h1 className="page-title">2019 BMW X5 xDrive40i</h1>
        <div className="header-actions">
          <Button variant="secondary" className="mr-2">View in Auctions</Button>
          <Button variant="outline">Print Details</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Car Images Section */}
<div className="md:col-span-2">
      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <Card className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Car Images
          </h2>
        </Card>
        <Card className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg opacity-0 animate-fade-in ${index === 0 ? 'delay-100' : index === 1 ? 'delay-200' : index === 2 ? 'delay-300' : index === 3 ? 'delay-400' : 'delay-500'}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-32 w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="mt-4 w-full sm:w-auto px-6 py-2 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Upload Images
          </Button>
        </Card>
      </Card>
    </div>

        {/* Dealer Assignment & Expenses */}
        <div className="md:col-span-1 space-y-4">
          {/* Dealer Assignment */}
          <Card>
            <Card className="flex justify-between items-center">
              <h2>Dealer Assignment</h2>
              <Link className="text-blue-500">Change</Link>
            </Card>
            <Card>
              <div className="flex items-center space-x-2">
                <img src="https://via.placeholder.com/40" alt="Dealer" className="rounded-full" />
                <div>
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-yellow-500">★★★★★ 4.5</p>
                  <p>Luxury Motors Seattle</p>
                </div>
              </div>
            </Card>
          </Card>

          {/* Expenses */}
          <Card>
            <Card className="flex justify-between items-center">
              <h2>Expenses</h2>
              <Link className="text-blue-500">Add Expense</Link>
            </Card>
            <Card>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Detailing Service</span>
                  <span>$350 - Jun 2, 2023</span>
                </li>
                <li className="flex justify-between">
                  <span>Brake Replacement</span>
                  <span>$780 - May 28, 2023</span>
                </li>
                <li className="flex justify-between">
                  <span>Oil Change</span>
                  <span>$120 - May 20, 2023 <span className="text-green-500">✓</span></span>
                </li>
                <li className="flex justify-between">
                  <span>Tire Replacement</span>
                  <span>$1,200 - May 20, 2023 <span className="text-green-500">✓</span></span>
                </li>
              </ul>
              <p className="mt-2 font-semibold">Total Expenses: $2,450</p>
            </Card>
          </Card>
        </div>

        {/* Vehicle Details */}
        <Card className="md:col-span-2">
          <Card>
            <h2>Vehicle Details</h2>
          </Card>
          <Card>
            <div className="grid grid-cols-2 gap-2">
              <p><span className="font-semibold">VIN:</span> 5UXCR6C56KL78943</p>
              <p><span className="font-semibold">Make:</span> BMW</p>
              <p><span className="font-semibold">Model:</span> X5 xDrive40i</p>
              <p><span className="font-semibold">Year:</span> 2019</p>
              <p><span className="font-semibold">Mileage:</span> 42,568 miles</p>
              <p><span className="font-semibold">Exterior Color:</span> Black Sapphire Metallic</p>
              <p><span className="font-semibold">Interior Color:</span> Cognac Vernasca Leather</p>
              <p><span className="font-semibold">Engine:</span> 3.0L TwinPower Turbo</p>
              <p><span className="font-semibold">Transmission:</span> 8-Speed Automatic</p>
              <p><span className="font-semibold">Drivetrain:</span> All-Wheel Drive</p>
              <p><span className="font-semibold">Fuel Type:</span> Gasoline</p>
              <p><span className="font-semibold">MPG:</span> 20 City / 26 Highway</p>
            </div>
            <p className="mt-2 text-gray-600">
              Description: This 2019 BMW X5 xDrive40i is in excellent condition with only 42,568 miles. It comes equipped with the Premium Package, featuring panoramic sunroof, head-up display, and gesture control. The vehicle also includes the Driving Assistance Professional Package with adaptive cruise control and lane keeping assist. The Black Sapphire Metallic exterior is paired with a luxurious Cognac Vernasca Leather interior. Additional features include 20-inch V-spoke wheels, heated front seats, wireless charging, and Apple CarPlay compatibility. This X5 has been meticulously maintained with full service history available. It has passed our comprehensive 150-point inspection and comes with a 3-month/3,000-mile limited warranty.
            </p>
          </Card>
        </Card>

        {/* Documents */}
        <Card className="md:col-span-1">
          <Card>
            <h2>Documents</h2>
          </Card>
          <Card>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Vehicle History Report</span>
                <span>PDF - 2.4 MB</span>
              </li>
              <li className="flex justify-between">
                <span>Service Records</span>
                <span>PDF - 3.8 MB</span>
              </li>
              <li className="flex justify-between">
                <span>Title Document</span>
                <span>PDF - 1.2 MB</span>
              </li>
              <li className="flex justify-between">
                <span>Inspection Photos</span>
                <span>ZIP - 15.7 MB</span>
              </li>
              <li className="flex justify-between">
                <span>Expense Receipts</span>
                <span>ZIP - 8.3 MB</span>
              </li>
            </ul>
            <Button variant="outline" className="mt-2">Upload Document</Button>
          </Card>
        </Card>

        {/* Sales Data & Auction Status */}
        <Card className="md:col-span-2">
          <Card>
            <h2>Sales Data & Auction Status</h2>
          </Card>
          <Card className="grid grid-cols-2 gap-4">
            <div>
              <Button variant="primary" className="mb-2">Add Entry</Button>
              <p><span className="font-semibold">Acquisition Date:</span> March 15, 2023</p>
              <p><span className="font-semibold">Acquisition Cost:</span> $38,000</p>
              <p><span className="font-semibold">Target Sale Price:</span> $45,995</p>
              <p><span className="font-semibold">Estimated Profit:</span> $4,250</p>
            </div>
            <div>
              <p><span className="font-semibold">Auction Status:</span> Active Auction</p>
              <p><span className="font-semibold">Auction Start:</span> June 10, 2023 - 9:00 AM</p>
              <p><span className="font-semibold">Auction End:</span> June 17, 2023 - 6:00 PM</p>
              <p><span className="font-semibold">Reserve Price:</span> $42,000</p>
              <p><span className="font-semibold">Current Highest Bid:</span> $43,250</p>
              <Button variant="dark" className="mt-2">Upload Bid Proof</Button>
              <p className="text-sm text-gray-500 mt-1">Upload documentation to verify auction bids</p>
            </div>
          </Card>
        </Card>
      </div>
    </div>
  );
};

export default InventoryView;

//  <div className="md:col-span-2">
//       <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
//         <Card className="p-4 border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
//             Car Images
//           </h2>
//         </Card>
//         <Card className="p-4">
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//             {images.map((image, index) => (
//               <div
//                 key={index}
//                 className="relative overflow-hidden rounded-lg group"
//               >
// <img
//   src={image.src}
//   alt={image.alt}
//   className="h-24 w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
//   onError={(e) => (e.target.src = '/path/to/fallback-image.jpg')}
// />
//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
//               </div>
//             ))}
//           </div>
//           <Button
//             variant="outline"
//             className="mt-4 w-full sm:w-auto px-6 py-2 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
//           >
//             Upload Images
//           </Button>
//         </Card>
//       </Card>
//     </div>