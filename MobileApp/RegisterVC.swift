//
//  RegisterVC.swift
//  
//
//  Created by Stephanie Tam on 7/27/19.
//

import UIKit

class RegisterVC: UIViewController {
    
    @IBAction func RegisterPressed(_ sender: Any) {
        let vc = self.storyboard?.instantiateViewController(withIdentifier: "LoginVC") as! LoginVC
        self.present(vc, animated: false, completion: nil)
    }
    
}
