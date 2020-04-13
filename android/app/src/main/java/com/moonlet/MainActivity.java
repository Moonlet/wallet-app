package com.moonlet;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import androidx.constraintlayout.widget.ConstraintLayout;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Moonlet";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // this.antidebug();
  }

  @Override
  protected void onPause() {
    super.onPause();

    try {
      View rootLayout = getWindow().getDecorView();
      View.inflate(this, R.layout.overlay, (ViewGroup) rootLayout);
    } catch (Exception e) {
      // just making sure this will not cause an app crash
    }

  }

  @Override
  protected void onResume() {
    super.onResume();
    try {
      ViewGroup rootLayout = (ViewGroup) getWindow().getDecorView();
      ConstraintLayout bgElement = findViewById(R.id.overlay);
      rootLayout.removeView(bgElement);
    } catch (Exception e) {
      // just making sure this will not cause an app crash
    }
  }

  // static {
  // System.loadLibrary("anti-debug");
  // }

  // public native void antidebug();
}
