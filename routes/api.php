
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WetaractController;

Route::prefix('v1')->group(function () {
    // User Profile & Stats
    Route::get('/user', [WetaractController::class, 'getProfile']);
    Route::post('/profile/update', [WetaractController::class, 'updateProfile']);
    
    // Community & Growth Pact
    Route::get('/community', [WetaractController::class, 'getCommunityMembers']);
    Route::post('/pact/follow', [WetaractController::class, 'recordFollow']);
    
    // Campaigns
    Route::get('/campaigns', [WetaractController::class, 'getCampaigns']);
    Route::post('/campaigns/create', [WetaractController::class, 'createCampaign']);
    
    // Wallet & Membership
    Route::post('/membership/upgrade', [WetaractController::class, 'upgradeToElite']);
    Route::post('/wallet/deposit', [WetaractController::class, 'deposit']);
    Route::post('/wallet/withdraw', [WetaractController::class, 'withdraw']);
});
