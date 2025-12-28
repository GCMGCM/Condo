import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../../lib/mongoose';
import User from '../../../../models/user';
import UserLog from '../../../../models/user-log';
import AdminLog from '../../../../models/admin-log';
import Condo from '../../../../models/condo';
import CondoManager from '../../../../models/condo-manager';
import CondoManagerInvite from '../../../../models/condo-manager-invite';
import SupportInvite from '../../../../models/support-invite';

const ADMIN_EMAIL = 'marcondes.gustavo@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);

    await connectToMongo();

    // Verify user is the admin
    const user = await User.findById(session.id);
    if (!user || user.email !== ADMIN_EMAIL || !user.isAdmin) {
      return NextResponse.json({ message: 'Only system admin can reset data' }, { status: 403 });
    }

    // Get admin user ID to preserve
    const adminUser = await User.findOne({ email: ADMIN_EMAIL });
    if (!adminUser) {
      return NextResponse.json({ message: 'Admin user not found' }, { status: 404 });
    }

    // Delete all data except admin
    const results = {
      usersDeleted: 0,
      userLogsDeleted: 0,
      adminLogsDeleted: 0,
      condosDeleted: 0,
      condoManagersDeleted: 0,
      condoManagerInvitesDeleted: 0,
      supportInvitesDeleted: 0,
    };

    // Delete all users except admin
    const usersResult = await User.deleteMany({ 
      _id: { $ne: adminUser._id } 
    });
    results.usersDeleted = usersResult.deletedCount || 0;

    // Delete all user logs
    const userLogsResult = await UserLog.deleteMany({});
    results.userLogsDeleted = userLogsResult.deletedCount || 0;

    // Delete admin logs except for admin's own logs
    const adminLogsResult = await AdminLog.deleteMany({ 
      email: { $ne: ADMIN_EMAIL } 
    });
    results.adminLogsDeleted = adminLogsResult.deletedCount || 0;

    // Delete all condos
    const condosResult = await Condo.deleteMany({});
    results.condosDeleted = condosResult.deletedCount || 0;

    // Delete all condo managers
    const managersResult = await CondoManager.deleteMany({});
    results.condoManagersDeleted = managersResult.deletedCount || 0;

    // Delete all condo manager invites
    const managerInvitesResult = await CondoManagerInvite.deleteMany({});
    results.condoManagerInvitesDeleted = managerInvitesResult.deletedCount || 0;

    // Delete all support invites
    const supportInvitesResult = await SupportInvite.deleteMany({});
    results.supportInvitesDeleted = supportInvitesResult.deletedCount || 0;

    return NextResponse.json({ 
      message: 'Data reset completed successfully',
      results 
    }, { status: 200 });
  } catch (err) {
    console.error('Data reset error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
