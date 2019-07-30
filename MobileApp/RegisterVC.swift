//
//  RegisterVC.swift
//  
//
//  Created by Stephanie Tam on 7/27/19.
//

import UIKit
import Moya

class RegisterVC: UIViewController {
    
    let provider = MoyaProvider<AuthService>()
    
    @IBOutlet weak var EmailField: UITextField!
    @IBOutlet weak var PasswordField: UITextField!
    @IBOutlet weak var ConfirmPWField: UITextField!
    @IBOutlet weak var NameField: UITextField!
    @IBOutlet weak var MNumberField: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
}
    
    @IBAction func RegisterPressed(_ sender: Any) {
        let pwd1 = PasswordField.text!
        let pwd2 = ConfirmPWField.text!
        if pwd1 != pwd2 {
            // Warn user that the two passwords did not match, then exit early to skip making the register request
            let alertController = UIAlertController(title: "Invalid Form",
                                                    message: "Password values do not match.",
                                                    preferredStyle: .alert)
            let close = UIAlertAction(title: "Close", style: .cancel, handler: nil)
            alertController.addAction(close)
            self.present(alertController, animated: true, completion: nil)
            return
        }
        
        // Make the API request to register the user
        provider.request(.registerStudent(email: EmailField.text!,
                                          password: PasswordField.text!,
                                          fullName: NameField.text!,
                                          mNumber: MNumberField.text!))
                        { result in
                            // For now, because I'm tired of making storyboard segues, this is easy enough
                            let vc = self.storyboard?.instantiateViewController(withIdentifier: "LoginVC") as! LoginVC
                            self.present(vc, animated: false, completion: nil)
                        }
    }

}
