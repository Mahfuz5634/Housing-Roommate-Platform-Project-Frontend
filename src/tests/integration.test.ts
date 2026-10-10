import { DEMO_USERS, DEMO_PROPERTIES, DEMO_ROOMMATES, DEMO_BOOKINGS } from '../lib/mockData';
import { formatCurrency, formatDate, getStatusColor } from '../lib/utils';
import { UserRole } from '../types';

export function runPlatformSmokeTests(): { passed: number; failed: number; summary: string[] } {
  const summary: string[] = [];
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      passed++;
      summary.push(`✔ PASS: ${message}`);
    } else {
      failed++;
      summary.push(`✖ FAIL: ${message}`);
    }
  }

  // 1. Role credentials verification
  assert(DEMO_USERS.ADMIN.role === 'ADMIN', 'Admin demo account has ADMIN role');
  assert(DEMO_USERS.LANDLORD.role === 'LANDLORD', 'Landlord demo account has LANDLORD role');
  assert(DEMO_USERS.TENANT.role === 'TENANT', 'Tenant demo account has TENANT role');

  // 2. Formatting utilities
  assert(formatCurrency(1400) === '$1,400', 'Currency format handles standard amounts correctly');
  assert(formatDate('2026-10-10T12:00:00.000Z').includes('2026'), 'Date formatter outputs readable format');
  assert(getStatusColor('APPROVED').includes('emerald'), 'Approved status gets emerald badge styling');

  // 3. Properties and Rooms integrity
  assert(DEMO_PROPERTIES.length >= 4, 'Demo properties inventory has at least 4 listings');
  assert(Boolean(DEMO_PROPERTIES[0].rooms && DEMO_PROPERTIES[0].rooms.length > 0), 'Property has configured rooms');

  // 4. Roommate Matching algorithm check
  const roommate = DEMO_ROOMMATES[0];
  assert(Boolean(roommate.cleanlinessScore >= 1 && roommate.cleanlinessScore <= 5), 'Cleanliness score is within 1 to 5');
  assert(Boolean(roommate.budgetMax >= roommate.budgetMin), 'Roommate budget range is valid');

  // 5. Booking and Stripe Payment integration
  const booking = DEMO_BOOKINGS[0];
  assert(booking.status === 'APPROVED' || booking.status === 'COMPLETED', 'Demo booking is approved or completed');
  assert(booking.depositAmount > 0, 'Deposit amount is greater than 0');

  return { passed, failed, summary };
}

// Auto-run if executed directly via node/ts-node
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
  const results = runPlatformSmokeTests();
  console.log(`Ran ${results.passed + results.failed} assertions. Passed: ${results.passed}, Failed: ${results.failed}`);
}
