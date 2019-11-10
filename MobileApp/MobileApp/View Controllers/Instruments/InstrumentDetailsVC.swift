//
//  InstrumentDetailsVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/23/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit
import Moya

class InstrumentDetailsVC: UIViewController {
    
    var instrument: Instrument? = nil
    
    private var endpointRequest: String = ""
    private var provider = MoyaProvider<InstrumentService>()
    
    @IBOutlet var conditionField: UITextField!
    @IBOutlet var kindField: UITextField!
    @IBOutlet var makeField: UITextField!
    @IBOutlet var modelField: UITextField!
    @IBOutlet var serialNumberField: UITextField!
    @IBOutlet var assetNumberField: UITextField!
    @IBOutlet var tagNumberField: UITextField!
    @IBOutlet var requestButton: UIButton!
    
    override func viewDidLoad() {
        endpointRequest = instrument == nil ? "Create" : "Update"
        updateInfo()
    }
    
    private func updateInfo() {
        requestButton?.setTitle(endpointRequest, for: .normal)
        guard let i = instrument else { return }
        conditionField?.text = i.condition.rawValue
        kindField?.text = i.kind.rawValue
        makeField?.text = i.make
        modelField?.text = i.model
        serialNumberField?.text = i.serialNumber
        assetNumberField?.text = i.ucAssetNumber
        tagNumberField?.text = i.ucTagNumber
    }
    
    private func constructInstrument() -> Instrument? {
        // TODO: Definitely going to need better handling of optional strings here
        var id: Int = 1
        if instrument != nil { id = instrument!.id }
        if let kind = getInstrumentKind() {
            return Instrument(id: id,
                              name: "",
                              condition: AssetCondition(rawValue: conditionField!.text!)!,
                              kind: kind,
                              make: makeField!.text!,
                              model: modelField!.text!,
                              serialNumber: serialNumberField!.text!,
                              ucTagNumber: tagNumberField!.text!,
                              ucAssetNumber: assetNumberField!.text!)
        }
        return nil
    }
    
    private func sendRequest() {
        guard let i = constructInstrument() else { return }
        switch endpointRequest.lowercased() {
        case "create":
            provider.request(.addInstrument(i)) { result in }
        case "update":
            provider.request(.updateInstrument(id: i.id, instrument: i)) { result in }
        default:
            break
        }
    }
    
    private func getInstrumentKind() -> InstrumentKind? {
        return InstrumentKind(rawValue: kindField!.text!)
    }
    
    @IBAction func requestButtonPressed(_ sender: Any) {
        sendRequest()
    }
}
