/** Static UI config — not stored in the database */

export const directoryCategories = ['All', 'Health', 'Education', 'Shops', 'Emergency', 'Govt'];

export const marketTags = ['Grain', 'Produce', 'Livestock', 'Equipment'];

export const grievanceCategories = [
  { id: 'c1', label: 'Water Supply', icon: 'water' },
  { id: 'c2', label: 'Electricity', icon: 'flash' },
  { id: 'c3', label: 'Roads', icon: 'trail-sign' },
  { id: 'c4', label: 'Sanitation', icon: 'trash' },
  { id: 'c5', label: 'Health', icon: 'medkit' },
  { id: 'c6', label: 'Other', icon: 'ellipsis-horizontal' },
];

export const onboardingSlides = [
  { id: 'o1', icon: 'megaphone', title: 'Stay Informed', text: 'Get Panchayat notices, weather alerts and event updates the moment they happen.' },
  { id: 'o2', icon: 'call', title: 'Reach Anyone', text: 'Doctors, school, police, sarpanch and ration shop — all contacts a tap away.' },
  { id: 'o3', icon: 'storefront', title: 'Buy & Sell Local', text: 'Trade crops, livestock and equipment with neighbours in your village.' },
  { id: 'o4', icon: 'shield-checkmark', title: 'Help & Emergency', text: 'Raise civic grievances and reach emergency services instantly when it matters.' },
];

export function buildCacheSnapshot(data) {
  return {
    announcements: data.announcements,
    directory: data.directory,
    marketItems: data.marketItems,
    schemes: data.schemes,
    mandiPrices: data.mandiPrices,
    panchayatCalendar: data.panchayatCalendar,
    helpBoard: data.helpBoard,
  };
}
