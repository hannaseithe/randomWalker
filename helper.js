function Binding(b) {
    var _this = this;
    this.elementBindings = [];
    this.value = b.object[b.property];
    this.type = typeof this.value;
    this.valueGetter = function () {
        return _this.value;
    }
    this.valueSetter = function (val) {

        if ((typeof val == "number") && (val > 0) || typeof val != "number") {
            _this.value = val
            for (var i = 0; i < _this.elementBindings.length; i++) {

                var binding = _this.elementBindings[i]
                if (binding.element["type"] == "radio") {
                    binding.element.checked = binding.element[binding.attribute] == val
                } else {
                    binding.element[binding.attribute] = val
                }

            }
        }

    }
    this.addBinding = function (element, attribute, event) {
        var binding = {
            element: element,
            attribute: attribute
        }
        if (event) {
            element.addEventListener(event, function (event) {
                var val = element[attribute];
                switch (_this.type) {
                    case "number":
                        val = Number(element[attribute]);
                        break;
                }
                _this.valueSetter(val);
            })
            binding.event = event
        }
        this.elementBindings.push(binding)
        element[attribute] = _this.value
        return _this
    }
    this.addRadioBinding = function (element, attribute, event) {
        var binding = {
            element: element,
            attribute: attribute
        }
        if (event) {
            element.addEventListener(event, function (event) {
                if (element.checked) {
                    var val = element[attribute];
                    switch (_this.type) {
                        case "number":
                            val = Number(element[attribute]);
                            break;
                    }
                    _this.valueSetter(val);
                }
            })
            binding.event = event
        }
        this.elementBindings.push(binding);
        element.checked = _this.value == element[attribute];
        return _this
    }

    Object.defineProperty(b.object, b.property, {
        get: this.valueGetter,
        set: this.valueSetter
    });

    b.object[b.property] = this.value;
}