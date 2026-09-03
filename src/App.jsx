import income from './assets/images/profit.png'
import profileUser from './assets/images/profileuser.png'
import deliveryMan from './assets/images/deliveryman.png'
import deliver from './assets/images/auction.png'
import DailyOverViewChart from './Components/DailyOverViewChart/DailyOverViewChart'
import IncomeOverview from './Components/IncomeOverview/IncomeOverview'
import { Link } from 'react-router-dom'
import ProfileUpdateRequest from './Components/ProfileUpdateRequest/ProfileUpdateRequest'
import './App.css'
import { useGetPendingPartnerQuery, useOverviewDashboardQuery } from './redux/api/dashboardHomeApi'
import { imageUrl } from './redux/api/baseApi'
import Loading from './Components/Loading/Loading'
function App() {

  // all API
  const { data: getOverView, isLoading: isOverviewLoading } = useOverviewDashboardQuery();
  const { data: getPendingPartner, isLoading: isPartnerLoading } = useGetPendingPartnerQuery()

  // 
  const data = [
    {
      title: 'Total Income',
      icon: income,
      count: `$${getOverView?.data? getOverView?.data?.income.toFixed(2):0}`,
    },
    {
      title: 'Total User',
      icon: profileUser,
      count: `${getOverView?.data? getOverView?.data?.users: 0}`,
    },
    {
      title: 'Total Partner',
      icon: deliveryMan,
      count: `${getOverView?.data? getOverView?.data?.partner: 0}`,
    },
    {
      title: 'Total Auction',
      icon: deliver,
      count: `${getOverView?.data? getOverView?.data?.services: 0}`,
    }
  ]



  // table data 
  const formattedTableData = getPendingPartner?.data?.data?.slice(0,4)?.map((partner, i) => {
    // console.log(partner);
        console.log("=== getPendingPartner ===",partner, i);
    return (
      {
        key: i + 1,
        name: partner?.name,
        img: `${imageUrl}${partner?.profile_image}`,
        email: partner?.email,
        contact:partner?.phone_number,
        // vichelType: 'car',
        // vichelNumber: "A 23445355",
        drivingLicense: `${imageUrl}${partner?.drivingLicenseImage}`,
        vichelImg: `${imageUrl}${partner?.vehicleFrontImag}`,
        // passport: 759175632578,
        location: partner?.country,
        status : partner?.status,
        city: partner?.city,
        address: `${partner?.city || ""}, ${partner?.country || ""}, ${partner?.status || ""}`,
        vehicleFrontImage : `${imageUrl}${partner?.vehicleFrontImage}`,
        vehicleBackImage : `${imageUrl}${partner?.vehicleBackImage}`,
        vehicleSideImage :  `${imageUrl}${partner?.vehicleSideImage}`,
        licensePlateImage : `${imageUrl}${partner?.licensePlateImage}`,
        drivingLicenseImage :`${imageUrl}${partner?.drivingLicenseImage}`,
        vehicleInsuranceImage : `${imageUrl}${partner?.vehicleInsuranceImage}`,
        vehicleRegistrationCardImage : `${imageUrl}${partner?.vehicleRegistrationCardImage}`


      }
    )
  })


  return (
    <div>

      {/*  statistics card for dashboard home page */}
      <div className="grid grid-cols-4 justify-center items-center gap-5">
        {
          isOverviewLoading
            ? <div className='col-span-4'><Loading type="card" /></div>
            : data?.map((item, index) => (
              <div className='w-full h-full flex justify-center items-center flex-col gap-3 py-7 bg-[#FEFEFE] p-2 rounded-md' key={index}>
                <p className='text-2xl font-medium'>{item?.title}</p>
                <img src={item?.icon} className='my-[5px]' />
                <p className='text-3xl font-semibold'>{item?.count}</p>
              </div>
            ))
        }
      </div>

      {/* Chart */}
      <div className='grid grid-cols-2 mt-5 gap-5'>
        <div className='w-full h-full bg-white p-4 rounded-md'>
          <IncomeOverview />
        </div>
        <div className='w-full h-full bg-white p-4 rounded-md'>
          <DailyOverViewChart />
        </div>
      </div>


      {/* Profile update request section */}
      <div className="mt-5 bg-[white] p-5 rounded-md">

        <div className='flex justify-between items-center gap-2 mb-3 p-5'>
          <p className='text-xl font-semibold'>Partner Registration/ Update Request</p> <Link to={`/profile-update-request`}>
            View all
          </Link>
        </div>

        {isPartnerLoading
          ? <Loading type="table" />
          : <ProfileUpdateRequest dataSource={formattedTableData} />
        }
      </div>


    </div>
  )
}

export default App
