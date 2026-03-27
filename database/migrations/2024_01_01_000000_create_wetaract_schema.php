
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('avatar')->nullable();
            $table->decimal('wallet_balance', 15, 2)->default(0.00);
            $table->boolean('is_elite_verified')->default(false);
            $table->json('interests')->nullable();
            $table->string('referral_code')->unique();
            $table->timestamps();
        });

        Schema::create('social_handles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('platform'); // Instagram, Spotify, etc.
            $table->string('handle');
            $table->string('profile_url');
            $table->timestamps();
        });

        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('platform');
            $table->string('action_type');
            $table->string('link');
            $table->text('description');
            $table->integer('total_slots');
            $table->integer('remaining_slots');
            $table->decimal('reward_value', 10, 2);
            $table->enum('reward_type', ['Points', 'Cash']);
            $table->boolean('use_ai')->default(false);
            $table->string('target_location')->default('Global');
            $table->timestamps();
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->enum('type', ['Earning', 'Withdrawal', 'Campaign_Spend', 'Deposit']);
            $table->string('description');
            $table->enum('status', ['Pending', 'Completed']);
            $table->timestamps();
        });

        Schema::create('follows_pact', function (Blueprint $table) {
            $table->id();
            $table->foreignId('follower_id')->constrained('users');
            $table->foreignId('following_id')->constrained('users');
            $table->string('platform');
            $table->boolean('is_reciprocal')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('follows_pact');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('campaigns');
        Schema::dropIfExists('social_handles');
        Schema::dropIfExists('users');
    }
};
