import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/es/modal/Modal';

export const modalCheck = (props: ModalFuncProps) =>
  new Promise(resolve => {
    Modal.confirm({
      ...props,
      okText: '确认',
      cancelText: '取消',
      onOk: () => resolve(true),
    });
  });
