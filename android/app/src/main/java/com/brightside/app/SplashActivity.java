package com.brightside.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.launch_screen);
        Intent newIntent = getIntent();
        String action = newIntent.getAction();
        Uri data = newIntent.getData();

        Intent intent = new Intent(this, MainActivity.class);
        // Pass along FCM messages/notifications etc.
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            intent.putExtras(extras);
        }
        startActivity(intent);
        finish();
    }
}
