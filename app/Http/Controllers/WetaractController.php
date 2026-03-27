
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Campaign;
use App\Models\Transaction;
use App\Models\FollowPact;
use Illuminate\Support\Facades\DB;

class WetaractController extends Controller
{
    public function getProfile(Request $request)
    {
        // For demo, we assume user ID 1. In production, use $request->user()
        return User::with(['socialHandles', 'transactions'])->find(1);
    }

    public function upgradeToElite(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $user = User::find(1);
            $promoPrice = 10.00;

            if ($user->wallet_balance < $promoPrice) {
                return response()->json(['error' => 'Insufficient balance'], 400);
            }

            $user->wallet_balance -= $promoPrice;
            $user->is_elite_verified = true;
            $user->save();

            Transaction::create([
                'user_id' => $user->id,
                'amount' => $promoPrice,
                'type' => 'Campaign_Spend',
                'description' => 'Founding Member Promo Activation',
                'status' => 'Completed'
            ]);

            return response()->json(['message' => 'Upgrade successful', 'user' => $user]);
        });
    }

    public function recordFollow(Request $request)
    {
        $request->validate([
            'target_id' => 'required|exists:users,id',
            'platform' => 'required'
        ]);

        $follower = User::find(1);
        $target = User::find($request->target_id);

        FollowPact::create([
            'follower_id' => $follower->id,
            'following_id' => $target->id,
            'platform' => $request->platform
        ]);

        // Logic for Pact Notification
        // In real app, push to socket or notification table
        return response()->json(['message' => "Pact notification sent to {$target->name}"]);
    }

    public function createCampaign(Request $request)
    {
        $request->validate([
            'budget' => 'required|numeric|min:5',
            'is_paid' => 'required|boolean'
        ]);

        $user = User::find(1);

        if ($request->is_paid && $user->wallet_balance < $request->budget) {
            return response()->json(['error' => 'Insufficient funds'], 400);
        }

        $campaign = Campaign::create([
            'user_id' => $user->id,
            'platform' => $request->platform,
            'action_type' => $request->action_type,
            'link' => $request->link,
            'description' => $request->description,
            'total_slots' => $request->is_paid ? $request->budget * 50 : 50,
            'remaining_slots' => $request->is_paid ? $request->budget * 50 : 50,
            'reward_value' => $request->is_paid ? ($request->budget * 0.9) / ($request->budget * 50) : 10,
            'reward_type' => $request->is_paid ? 'Cash' : 'Points'
        ]);

        if ($request->is_paid) {
            $user->wallet_balance -= $request->budget;
            $user->save();
        }

        return response()->json($campaign);
    }
}
