//
//  UniformDetailsVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/24/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit
import Moya

class UniformDetailsVC: UIViewController {
    
    var uniform: UniformPiece? = nil
    
    private var endpointRequest: String = ""
    private var provider = MoyaProvider<UniformService>()
    
    @IBOutlet weak var kindField: UITextField!
    @IBOutlet weak var numberField: UITextField!
    @IBOutlet weak var sizeField: UITextField!
    @IBOutlet weak var conditionField: UITextField!
    @IBOutlet weak var requestButton: UIButton!
    
    override func viewDidLoad() {
        endpointRequest = uniform == nil ? "Create" : "Update"
        updateInfo()
    }
    
    private func updateInfo() {
        requestButton?.setTitle(endpointRequest, for: .normal)
        guard let u = uniform else { return }
        kindField?.text = u.kind.rawValue
        numberField?.text = u.number
        sizeField?.text = u.size
        conditionField?.text = u.condition.rawValue
    }
    
    private func constructUniform() -> UniformPiece? {
        // TODO: Definitely going to need better handling of optional strings here
        var id = 1
        if uniform != nil { id = uniform!.id }
        return UniformPiece(id: id,
                            name: "",
                            condition: AssetCondition(rawValue: conditionField!.text!)!,
                            kind: UniformKind(rawValue: kindField!.text!)!,
                            size: sizeField!.text!,
                            number: numberField!.text!)
    }
    
    private func sendRequest() {
        guard let u = constructUniform() else { return }
        switch endpointRequest.lowercased() {
        case "create":
            provider.request(.addUniform(u)) { result in }
        case "update":
            provider.request(.updateUniform(id: u.id, uniform: u)) { result in }
        default:
            break
        }
    }
    
    @IBAction func requestButtonPressed(_ sender: Any) {
        sendRequest()
    }
    
}
