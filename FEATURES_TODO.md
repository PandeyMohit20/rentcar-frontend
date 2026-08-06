# Search / Car Listing / Car Details — Feature Build Checklist

## 1. Infrastructure & Constants

- [ ] Add COMPARE route to `src/constants/routes.js`
- [ ] Add SIMILAR / AVAILABILITY / BY_IDS endpoints to `src/constants/apiEndpoints.js`
- [ ] Add SIMILAR / AVAILABILITY / BY_IDS query keys to `src/constants/queryKeys.js`
- [ ] Add filter option constants (brands, categories, seats, amenities, sort)

## 2. Types

- [ ] Expand `src/types/car.js` with availability, pricing, host, policy shapes

## 3. Validators

- [ ] Add `carFilterSchema` to `src/validators/carValidator.js`

## 4. Redux

- [ ] Create `src/redux/slices/comparisonSlice.js` (max 3 cars)
- [ ] Register comparison slice in `src/redux/store/index.js`

## 5. Services

- [ ] Add `getSimilarCars`, `getAvailability`, `getCarsByIds` to `carService`

## 6. Feature: search

- [ ] `SearchBar`, `LocationSelector`, `DateRangePicker`, `PopularLocations`, `RecentSearches`, `useSearchHistory`

## 7. Feature: listing

- [ ] `FilterSidebar`, `PriceSlider`, `TransmissionFilter`, `FuelTypeFilter`, `BrandFilter`, `CategoryFilter`, `SeatsFilter`, `RatingFilter`, `SortDropdown`, `CarGrid`, `CarList`, `CarCard`, `LoadingSkeleton`

## 8. Feature: car

- [ ] `CarGallery`, `CarImageCarousel`, `CarOverview`, `CarFeatures`, `CarSpecifications`, `CarPolicies`, `CarReviews`, `SimilarCars`, `CarFaq`

## 9. Feature: availability

- [ ] `AvailabilityCalendar`

## 10. Feature: pricing

- [ ] `PriceBreakdown`

## 11. Feature: comparison

- [ ] `CompareBar`, `useComparison`

## 12. Feature: wishlist

- [ ] `FavoriteButton`, `useWishlist`

## 13. Shared components

- [ ] `BookingSummary`, `StickyBookingCard`, `Breadcrumb`, `ShareButton`

## 14. Pages

- [ ] Rewrite `src/pages/Search/index.jsx`
- [ ] Rewrite `src/pages/CarDetails/index.jsx`
- [ ] Upgrade `src/pages/Wishlist/index.jsx`
- [ ] Create `src/pages/Compare/index.jsx`

## 15. Routes

- [ ] Wire Compare route in `src/routes/index.jsx`

## 16. Verification

- [ ] `npm run build` — no errors
- [ ] `npm run lint` — no new warnings
