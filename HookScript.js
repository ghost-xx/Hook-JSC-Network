function hook_jsc() {
    Java.perform(function () {
        var lib = "libcocos2djs.so";
        /************************************************ */
        var ws_send_1 = "_ZN13WebSocketImpl4sendEPKhj";
        var ws_send_2 =
            "_ZN13WebSocketImpl4sendERKNSt6__ndk112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE";
        var ws_receive = "_ZN13WebSocketImpl20onClientReceivedDataEPvl";
        /********************* XML ***************************** */
        var xml_set_data = "_ZN14XMLHttpRequest18setHttpRequestDataEPKcm";
        var xml_set_header =     "_ZN14XMLHttpRequest16setRequestHeaderERKNSt6__ndk112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEES8_";
        var xml_get_response =
            "_ZN7cocos2d7network10HttpClient15processResponseEPNS0_12HttpResponseEPc";
        var ptr_xml_set_data = Module.findExportByName(lib, xml_set_data);
        var ptr_xml_set_header = Module.findExportByName(lib, xml_set_header);
        var ptr_xml_get_response = Module.findExportByName(lib, xml_get_response);

        /****************   WebSocket   ************** */
        var ptr_ws_send_1 = Module.findExportByName(lib, ws_send_1);
        var ptr_ws_send_2 = Module.findExportByName(lib, ws_send_2);
        var ptr_ws_receive = Module.findExportByName(lib, ws_receive);

        /****************   XML   ************** */
        Interceptor.attach(ptr_xml_set_header, {
            onEnter: function (args) {
                console.log("*********** XmlHttp Request ***********");
                console.log("[URL]: " + args[0].add(448).readPointer().readCString());
                console.log("[Method]: " + args[0].add(457).readCString());
                console.log("[Header]: " + args[1].readCString() + args[2].readCString());
                console.log("\n");
            },
        });

        Interceptor.attach(ptr_xml_set_data, {
            onEnter: function (args) {
                console.log("[Data]: " + args[1].readCString());
                console.log("[Size]: " + args[2].toInt32());
                console.log("\n");
            },
        });

        var httpResponse;
        Interceptor.attach(ptr_xml_get_response, {
            onEnter: function (args) {
                httpResponse = args[1];
            },
            onLeave: function (retval) {
                var responeData = new NativePointer(httpResponse.add(32));
                var responeHeader = new NativePointer(httpResponse.add(56));

                console.log("*********** XmlHttp Response ***********");
                console.log(
                    responeHeader.readPointer().readCString() +
                    responeData.readPointer().readCString()
                );
                console.log("\n");
            },
        });

        /****************   Websocket   ************** */
        Interceptor.attach(ptr_ws_send_1, {
            onEnter: function (args) {
                console.log("*********** Websocket Send ***********");
                var host = new NativePointer(args[0].add(72));
                var cert = new NativePointer(args[0].add(328));
                console.log("[Host]: " + host.readPointer().readCString());
                console.log("[CERT]: " + cert.readPointer().readCString());
                console.log("[DATA]:");
                console.log(args[1].readByteArray(args[2].toUInt32()));
                console.log("\n");
            },
        });

        Interceptor.attach(ptr_ws_send_2, {
            onEnter: function (args) {
                console.log(
                    "!!! Detect ws_send_2 is being used, more work to be done..."
                );
            },
        });

        Interceptor.attach(ptr_ws_receive, {
            onEnter: function (args) {
                console.log("*********** Websocket Receive ***********");
                var host = new NativePointer(args[0].add(72));
                var cert = new NativePointer(args[0].add(328));
                console.log("[Host]: " + host.readPointer().readCString());
                console.log("[CERT]: " + cert.readPointer().readCString());
                console.log("[DATA]:");
                console.log(args[1].readByteArray(args[2].toUInt32()));
                console.log("\n");
                // args[2] is the size of argv[1]
            },
        });
    });


}

setImmediate(hook_jsc);