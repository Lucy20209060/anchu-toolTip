import Vue from 'vue';

const ToastConstructor = Vue.extend(require('./main.vue'));
let toastPool = [];
let toast = [];

let getAnInstance = () => {
  if (toastPool.length > 0) {
    let instance = toastPool[0];
    toastPool.splice(0, 1);
    return instance;
  }

  return new ToastConstructor({
    el: document.createElement('div')
  });

};

// 并不是很理解这个操作
let returnAnInstance = instance => {
  if (instance) {
    toastPool.push(instance);
  }
};

// 删除DOM元素
let removeDom = event => {
  if (event.target.parentNode) {
    event.target.parentNode.removeChild(event.target);
  }
  toast = [];
};

ToastConstructor.prototype.close = function() {
  // 隐藏并删除DOM元素
  this.visible = false;
  this.$el.addEventListener('transitionend', removeDom);
  this.closed = true;
  returnAnInstance(this);
};

let Toast = (options = {}) => {
  // 防止弹窗重复出现
  if(toast.length != 0){
    return 
  }
  toast.push(instance)

  let duration = options.duration || 3000;

  let instance = getAnInstance();
  instance.closed = false;
  clearTimeout(instance.timer);
  instance.message = typeof options === 'string' ? options : options.message;
  instance.position = options.position || 'middle';
  instance.className = options.className || '';
  instance.iconClass = options.iconClass || '';

  document.body.appendChild(instance.$el);
  Vue.nextTick(function() {
    instance.visible = true;
    instance.$el.removeEventListener('transitionend', removeDom);
    ~duration && (instance.timer = setTimeout(function() {
      if (instance.closed) return;
      instance.close();
    }, duration));
  });
  return instance;
};

export default Toast;
