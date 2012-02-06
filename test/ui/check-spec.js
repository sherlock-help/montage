/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage").Montage,
    TestPageLoader = require("support/testpageloader").TestPageLoader,
    ActionEventListener = require("montage/core/event/action-event-listener").ActionEventListener;

var testPage = TestPageLoader.queueTest("checktest", function() {
    var test = testPage.test;

    var mousedown = function(el) {
        var downEvent = document.createEvent("MouseEvent");
        downEvent.initMouseEvent("mousedown", true, true, el.view, null,
                el.offsetLeft, el.offsetTop,
                el.offsetLeft, el.offsetTop,
                false, false, false, false,
                el, null);
        el.dispatchEvent(downEvent);
        return downEvent;
    };
    var mouseup = function(el) {
        var upEvent = document.createEvent("MouseEvent");
        upEvent.initMouseEvent("mouseup", true, true, el.view, null,
                el.offsetLeft, el.offsetTop,
                el.offsetLeft, el.offsetTop,
                false, false, false, false,
                el, null);
        el.dispatchEvent(upEvent);
        return upEvent;
    };
    var clickEvent = function(el) {
        var clickEvent = document.createEvent("MouseEvent");
        clickEvent.initMouseEvent("click", true, true, el.view, null,
                el.offsetLeft, el.offsetTop,
                el.offsetLeft, el.offsetTop,
                false, false, false, false,
                el, null);
        el.dispatchEvent(clickEvent);
        return clickEvent;
    };
    var addListener = function(component, fn) {
        var buttonSpy = {
            doSomething: fn || function(event) {
                return 1+1;
            }
        };
        spyOn(buttonSpy, 'doSomething');

        var actionListener = Montage.create(ActionEventListener).initWithHandler_action_(buttonSpy, "doSomething");
        component.addEventListener("action", actionListener);

        return buttonSpy.doSomething;
    };
    var click = function(component, el, fn) {
        el = el || component.element;

        var listener = addListener(component, fn);

        mousedown(el);
        mouseup(el);
        clickEvent(el);

        // Return this so that it can be checked in the calling function.
        return listener;
    };
    var change = function(el) {
        var changeEvent = document.createEvent("HTMLEvents");
        changeEvent.initEvent("change", true, true);
        el.dispatchEvent(changeEvent);
        return changeEvent;
    };

    describe("ui/check-spec", function() {
        it("should load", function() {
            expect(testPage.loaded).toBe(true);
        });

        describe("checkbox", function(){
            describe("checked property", function() {
                it("is false if there is no `checked` attribute", function() {
                    expect(test.check1.checked).toBe(false);
                });
                it("is true if the `checked` attribute is set", function() {
                    expect(test.check2.checked).toBe(true);
                });

                it("can be set to false from the serialization", function() {
                    expect(test.check_szn1.checked).toBe(false);
                });
                it("can be set to true from the serialization", function() {
                    expect(test.check_szn2.checked).toBe(true);
                });

                it("can be set to true and checks the checkbox", function() {
                    runs(function() {
                        test.check1.checked = true;
                        expect(test.check1.checked).toBe(true);
                    });

                    testPage.waitForDraw();

                    runs(function(){
                        expect(test.check1.element.checked).toBe(true);
                    });

                });
                it("can be set to false and unchecks the checkbox", function() {
                    runs(function() {
                        test.check2.checked = false;
                        expect(test.check2.checked).toBe(false);
                    });

                    testPage.waitForDraw();

                    runs(function(){
                        expect(test.check2.element.checked).toBe(false);
                    });
                });

                describe("one-way binding", function() {
                    it("starts checked", function() {
                        runs(function() {
                            expect(test.check_bound1.element.checked).toBe(true);
                            expect(test.check_bound2.element.checked).toBe(true);

                            click(test.check_bound2);
                     });
                    });
                    it("unchecks both one way", function() {
                        testPage.waitForDraw();
                        runs(function() {
                            expect(test.check_bound1.element.checked).toBe(false);
                            expect(test.check_bound2.element.checked).toBe(false);

                            click(test.check_bound2);
                        });
                    });
                    it("checks both one way", function() {
                        testPage.waitForDraw();
                        runs(function() {
                            expect(test.check_bound1.element.checked).toBe(true);
                            expect(test.check_bound2.element.checked).toBe(true);

                            click(test.check_bound1);
                        });
                    });
                    it("doesn't bind the other way (unchecked)", function() {
                        testPage.waitForDraw();
                        runs(function() {
                            expect(test.check_bound1.element.checked).toBe(false);
                            expect(test.check_bound2.element.checked).toBe(true);

                            click(test.check_bound1);
                        });
                    });
                    it("doesn't bind the other way (checked)", function() {
                        testPage.waitForDraw();
                        runs(function() {
                            expect(test.check_bound1.element.checked).toBe(true);
                            expect(test.check_bound2.element.checked).toBe(true);

                            click(test.check_bound2);
                        });
                    });
                    it("unchecks both", function() {
                        testPage.waitForDraw();
                        runs(function() {
                            expect(test.check_bound1.element.checked).toBe(false);
                            expect(test.check_bound2.element.checked).toBe(false);
                        });
                    });
                });
            });

            it("checks when the label is clicked", function() {
                expect(test.check1.checked).toBe(true);


                var listener = addListener(test.check1);
                clickEvent(testPage.getElementById("label"));
                expect(listener).toHaveBeenCalled();
                expect(test.check1.checked).toBe(false);
            })

            describe("action event", function() {
                it("should fire when clicked", function() {
                    expect(click(test.check1)).toHaveBeenCalled();
                });
            });

            describe("inside a scroll view", function() {
                it("fires an action event when clicked", function() {
                    expect(test.scroll_check.checked).toBe(false);

                    expect(click(test.scroll_check)).toHaveBeenCalled();
                    expect(test.scroll_check.checked).toBe(true);
                });
                it("checks when the label is clicked", function() {
                    expect(test.scroll_check.checked).toBe(true);


                    var listener = addListener(test.scroll_check);
                    clickEvent(testPage.getElementById("scroll_label"));
                    expect(listener).toHaveBeenCalled();
                    expect(test.scroll_check.checked).toBe(false);
                })
                it("doesn't fire an action event when scrollview is dragged", function() {
                    var el = test.scroll_check.element;
                    var scroll_el = test.scroll.element;

                    var listener = addListener(test.scroll_check);

                    // mousedown
                    mousedown(el);

                    expect(test.scroll_check.checked).toBe(false);
                    expect(test.scroll.eventManager.isPointerClaimedByComponent(test.scroll._observedPointer, test.scroll)).toBe(false);

                    // Mouse move doesn't happen instantly
                    waits(10);
                    runs(function() {
                        // mouse move up
                        var moveEvent = document.createEvent("MouseEvent");
                        // Dispatch to scroll view, but use the coordinates from the
                        // button
                        moveEvent.initMouseEvent("mousemove", true, true, scroll_el.view, null,
                                el.offsetLeft, el.offsetTop - 100,
                                el.offsetLeft, el.offsetTop - 100,
                                false, false, false, false,
                                0, null);
                        scroll_el.dispatchEvent(moveEvent);

                        expect(test.scroll_check.checked).toBe(false);
                        expect(test.scroll.eventManager.isPointerClaimedByComponent(test.scroll._observedPointer, test.scroll)).toBe(true);

                        // mouse up
                        mouseup(el);

                        expect(listener).not.toHaveBeenCalled();
                    });

                });
            });

        });

        // The radio button uses the check-input class, which is pretty much
        // fully tested above. So fewer tests here.
        describe("radio button", function() {
            describe("checked property", function() {
                it("changes when the radio button is clicked", function() {
                    runs(function() {
                        expect(test.radio1.checked).toBe(false);

                        click(test.radio1);

                        expect(test.radio1.checked).toBe(true);
                    });
                });
            });
            describe("action event", function() {
                it("should fire when clicked", function() {
                    expect(click(test.radio2)).toHaveBeenCalled();
                });
                it("should not fire when another radio button in the same group is clicked", function() {
                    click(test.radio2);

                    var buttonSpy = {
                        doSomething: function(event) {
                            return 1+1;
                        }
                    };
                    spyOn(buttonSpy, 'doSomething');

                    var actionListener = Montage.create(ActionEventListener).initWithHandler_action_(buttonSpy, "doSomething");
                    test.radio1.addEventListener("action", actionListener);

                    click(test.radio3);
                    expect(buttonSpy.doSomething).not.toHaveBeenCalled();
                });
            });
        });
    });
});
