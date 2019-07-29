//
//  RegisterVC.swift
//  
//
//  Created by Stephanie Tam on 7/27/19.
//

import UIKit


class RegisterVC: UIViewController {
    @IBOutlet weak var EmailField: UITextField!
    @IBOutlet weak var PasswordField: UITextField!
    @IBOutlet weak var ConfirmPWField: UITextField!
     @IBOutlet weak var NameField: UITextField!
     @IBOutlet weak var MNumberField: UITextField!
    override func viewDidLoad() {
        super.viewDidLoad()
        EmailField.delegate = self as? UITextFieldDelegate
        PasswordField.delegate = self as? UITextFieldDelegate
        ConfirmPWField.delegate = self as? UITextFieldDelegate
        NameField.delegate = self as? UITextFieldDelegate
        MNumberField.delegate = self as? UITextFieldDelegate
    
}
    
    @IBAction func RegisterPressed(_ sender: Any)
    
    {
        let email: String = EmailField.text!
        let _: String = PasswordField.text!
        let _: String = ConfirmPWField.text!
        let fullName: String = NameField.text!
        let mNumber: String = MNumberField.text!
        
        
        //pop up to display info
        let alertController = UIAlertController(title: "Confirm Details", message:
            "Name: \(fullName), Email: \(email), MNumber: \(mNumber) ", preferredStyle: .alert)
        let Confirm = UIAlertAction(title: "Confirm", style: .default) {(UIAlertAction) -> Void in
        
            let vc = self.storyboard?.instantiateViewController(withIdentifier: "LoginVC") as! LoginVC
            self.present(vc, animated: false, completion: nil)
        }
        let Back = UIAlertAction(title: "Go Back", style: .cancel, handler: nil)
        
        alertController.addAction(Confirm)
        alertController.addAction(Back)
        self.present(alertController, animated: true, completion: nil)


    
}


}
