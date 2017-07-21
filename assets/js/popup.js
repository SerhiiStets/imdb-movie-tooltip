$().ready(function() {'use strict';
  load();

  $('#check_1').change(function() {
    if (this.checked) {
      saveChanges_plugin(true);
    } else {
      saveChanges_plugin(false);
    }
  });

  $('#check_2').change(function() {
    if (this.checked) {
      saveChanges_large_tooltip(true);
    } else {
      saveChanges_large_tooltip(false);
    }
  });
});


function saveChanges_plugin(plugin_fl) {
  chrome.storage.sync.set({
    "plugin": plugin_fl
  });
}

function saveChanges_large_tooltip(tooltip_size_fl) {
  chrome.storage.sync.set({
    "large_tooltip": tooltip_size_fl
  });
}

function load(callback) {
  chrome.storage.sync.get("plugin", function(item) {
    if (item.plugin === undefined) {
      saveChanges_plugin(true);
      if (callback) {
        callback();
      }
      return;
    }
    if (callback) {
      callback();
    }
    $('#check_1')[0].checked = item.plugin;
  });

  chrome.storage.sync.get("large_tooltip", function(item) {
    if (item.large_tooltip === undefined) {
      saveChanges_large_tooltip(false);
      if (callback) {
        callback();
      }
      return;
    }
    if (callback) {
      callback();
    }
    $('#check_2')[0].checked = item.large_tooltip;
  });
}
